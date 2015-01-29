'use strict';

var MILLISEC_IN_DAY = 1000 * 60 * 60 * 24;

Date.prototype.getWeek = function () {

  var d = new Date(+this);
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var yearMillisecOffset = (8 - yearStart.getDay()) * MILLISEC_IN_DAY;

  var yearMillis = d.getTime() - yearStart.getTime();
  return Math.floor((yearMillis + yearMillisecOffset) / (MILLISEC_IN_DAY * 7));

};

Date.prototype.toRKdate = function () {
  var year, month, day;
  year = String(this.getFullYear());
  month = String(this.getMonth() + 1);
  if (month.length === 1) {
    month = "0" + month;
  }
  day = String(this.getDate());
  if (day.length === 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
};

Date.prototype.isToday = function () {
  return Math.abs(this.getTime() - (new Date().getTime())) < MILLISEC_IN_DAY;
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var findOrCreate = require('mongoose-findorcreate')

var runkeeperClient = require('../../config/runkeeper');

var UserSchema = new Schema({
  name: String,
  role: {
    type: String,
    default: 'user'
  },

  runkeeperId: Number,
  accessToken: String,

  drinks: [{ date: { type: Date, default: Date.now } }],
  runs: [{ runId: Number, date: Date, distance: Number }],

  score: Number,
  lastUpdated: Date

});

UserSchema.plugin(findOrCreate);

/**
 * Virtuals
 */
// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

var validatePresenceOf = function(value) {
  return value && value.length;
};

var weekDifference = function (d1, d2) {
  return Math.abs(d2.getWeek() - d1.getWeek());
};

var getActivityFeedEndpoint = function (from, to, page, pageSize) {

  to = to || new Date();
  page = page || 0;
  pageSize = pageSize || 25;

  var baseEndPoint = '/fitnessActivities?';
  var params = [];
  params.push('page=' + String(page));
  params.push('pageSize=' + String(pageSize));
  params.push('noEarlierThan=' + from.toRKdate());
  params.push('noLaterThan=' + to.toRKdate());

  return baseEndPoint + params.join("&");
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
      next();
  });

// we need to calculate the score per week, because after each week there
// is an interest applied to any drinks that have not been run for.
//
// assumption: the current score is correct, and the last updated is when
// the last score has been calculated.
//
// in order to do this,
// 0) we have a prefetched list of all runs that have not been tallied.
// 1) we will rewind back to when the last update was.
// 2) apply the runs in order from oldest to newest, until there exists a
//    run that is newer than the week we are on
// 3) to any remaining drinks (score), we apply the interest.
// 4) we forward the week and then repeat, until we run out of runs.
var computeScoreRecursive = function (weekNum, runs, score, now) {
  if (runs.length === 0) {
    return score;
  }

  var run = runs.shift();

  console.log('weekNum: ' + weekNum);

  // apply all of the runs that are from that week to the score
  while (run !== undefined) {
    if (run.date.getWeek() > weekNum) {
      console.log('run.date.getWeek: ' + run.date.getWeek());
      // realised this run is for the next week. put it back in the array
      runs.unshift(run);
      break;
    }
    // otherwise deduct the score at 1km per drink.
    score = score - (run.distance / 1000);
    console.log(score);
    // go to the next run.
    run = runs.shift();
  }

  // if the score is above zero, and it is not the current week, we need
  // to apply interest as these are the drinks that were not satisfied.
  if (weekNum !== now.getWeek() && score > 0) {
    score = score * 1.25;
  }

  return computeScoreRecursive(weekNum + 1, runs, score, now);

};

/**
 * Methods
 */
UserSchema.methods = {

  getRunkeeperName: function (cb) {
    var self = this;
    runkeeperClient.access_token = self.accessToken;
    runkeeperClient.profile(function (err, response) {
        if (err) {
          return cb(false);
        }
        self.name = response.name;
        self.save(function(err) {
          if (err) {
            return cb(false);
          }
          return cb(true);
        });
    });
  },

  getNewRuns: function (cb) {
    var self = this;
    runkeeperClient.access_token = self.accessToken;

    var media_type = 'application/vnd.com.runkeeper.FitnessActivityFeed+json';
    var from = self.lastUpdated || new Date(2015, 0, 1);
    var endpoint = getActivityFeedEndpoint(from);

    runkeeperClient.apiCall('GET', media_type, endpoint, function (err, response) {
      if (err) {
        return cb(false);
      }
      var runs = response.items;
      var newRuns = [];
      var runId, date, distance;
      var lastRunId = (self.runs.length === 0) ? 0 : self.runs[self.runs.length - 1].runId;

      for (var i = 0; i < runs.length; i++) {
        runId = parseInt(runs[i].uri.split("/")[2], 10);
        if (runId > lastRunId) {
          date = new Date(runs[i].start_time);
          distance = runs[i].total_distance;
          newRuns.unshift({
            runId: runId,
            date: date,
            distance: distance
          });
        } else {
          console.log('already recorded');
        }

      }
      self.runs = self.runs.concat(newRuns);
      return cb(newRuns);
    });
  },

  computeNewScore: function (cb) {
    var self = this;
    var lastUpdated = self.lastUpdated || new Date(2015, 0, 1);
    var score = self.score || 0;
    var now = new Date();

    self.getNewRuns(function (newRuns) {
      if (!newRuns) {
        return cb(false);
      }
      score = computeScoreRecursive(lastUpdated.getWeek(), newRuns, score, now);
      self.score = score;
      self.lastUpdated = now;
      console.log('Score: ' + score);
      return cb(score);
    })

  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
