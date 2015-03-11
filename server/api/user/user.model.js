'use strict';

var MILLISEC_IN_DAY = 1000 * 60 * 60 * 24;
var FITNESS_ACTIVITY_MEDIA_TYPE = 'application/vnd.com.runkeeper.FitnessActivityFeed+json';
var BET_START_DATE = new Date(2015, 0, 1);
var INTEREST_RATE = 1.25;

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

var weekDifference = function (d1, d2) {
  return Math.abs(d2.getWeek() - d1.getWeek());
};

var validatePresenceOf = function (value) {
  return value && value.length;
};

/******************************************* END UTILITY METHODS *******************************************/


UserSchema.plugin(findOrCreate);

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  next();
});

/**
 * Virtuals
 */
// Public profile information
UserSchema.virtual('profile').get(function () {
  return {
    'name': this.name,
    'role': this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  };
});

/**
* Recursively gets all possible runs, by accessing the next page if there is any.
*/
var getAllRuns = function (accumulator, accessToken, endPoint, cb) {
  runkeeperClient.access_token = accessToken;
  runkeeperClient.apiCall('GET', FITNESS_ACTIVITY_MEDIA_TYPE, endPoint, function (err, response) {
    if (err) {
      return cb(false);
    }
    accumulator = accumulator.concat(response.items);
    if (response.next) {
      return getAllRuns(accumulator, accessToken, response.next, cb);
    } else {
      return cb(accumulator);
    }
  });
};

/**
* Generates the endpoint url in the right format based on dates, page and page size
*/
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
* computeScore walks through the weeks applying each week with the
* respective number of drinks, and then the respective number of runs.
* at the end, if its a computation from a past week, it will apply interest
* accordingly.
*
* Precondition: score is correct until startDate.
* Postcondition: score is correct until endDate.
*/
var computeScore = function (startDate, endDate, runs, drinks, score) {
  score = score || 0;
  var endWeek = endDate.getWeek();
  var run, drink;

  // the week incrementor.
  var visitingWeek = startDate.getWeek();

  // we end when we have visited every week between startDate and endDate
  while (visitingWeek <= endWeek) {
    // get the next oldest drink.
    drink = drinks.shift();
    // apply all of the drinks that are from that week to the score
    while (drink !== undefined) {
      // we ignore the drink counter if the drink is from before the startDate
      // or after the endDate.
      // the precondition implies this drink has already been included.
      // the postcondition does not care about anything that happens after
      // so just throw away.
      if (drink.date > startDate && drink.date < endDate) {
        // these drinks are all in the dates within start - end date.
        if (drink.date.getWeek() > visitingWeek) {
          // realised this drink is for the next week. put it back in the array
          drinks.unshift(drink);
          break;
        }
        // otherwise add score
        score++;
      }
      // go to the next drink.
      drink = drinks.shift();
    }

    // get the next oldest run.
    run = runs.shift();
    // apply all of the runs that are from that week to the score like drinks
    while (run !== undefined) {

      if (run.date > startDate && run.date < endDate) {
        if (run.date.getWeek() > visitingWeek) {
          // realised this run is for the next week. put it back in the array
          runs.unshift(run);
          break;
        }
        // otherwise deduct the score at 1km per drink.
        score = score - (run.distance / 1000);
      }
      // go to the next run.
      run = runs.shift();
    }

    // at this point, the score is accurate until the end of the visiting week.
    // so if theres any score left, apply interest and move on.
    // the only time we don't apply interest is if we are visiting the endWeek.
    // presumably, this "endWeek" has not ended  yet, so we should wait to
    // appl the interest.
    if (visitingWeek !== endWeek && score > 0) {
      score = score * INTEREST_RATE;
    }

    // now visit the next week and do the same thing.
    visitingWeek++;
  }

  return score;
};

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * getRunkeeperName - fetches the user's name from runkeeper.
   */
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

  /**
   * calcScore - calcualtes a new score based on the previous score.
   *
   * 1) refetches all the runs from the beginning of the bet from runkeeper
   * 2) use the computScore method to walk through the weeks and apply the runs/drinks
   */
  calcScore: function (drinks, cb) {
    var self = this;
    var endPoint = getActivityFeedEndpoint(this.lastUpdated);

    getAllRuns([], this.accessToken, endPoint, function (runs) {
      if (!runs) {
        console.log('something went wrong 1');
      }
      var newRuns = [];
      var runId, date, distance;
      var now = new Date();

      // lets organise the runs obtained from runkeeper into our own language.
      for (var i = 0; i < runs.length; i++) {
        runId = parseInt(runs[i].uri.split("/")[2], 10);
        date = new Date(runs[i].start_time);
        distance = runs[i].total_distance;
        // we want the oldest run to be in arr[0]
        // so array is in cronologically ascending order
        newRuns.unshift({
          runId: runId,
          date: date,
          distance: distance
        });
      }
      self.runs = self.runs.concat(newRuns);

      self.score = computeScore(self.lastUpdated, now, newRuns.slice(), drinks.slice(), self.score);
      self.lastUpdated = now;
      console.log('score: ' + self.score);
      return cb(self.score);
    });
  },

  /**
   * recalcScore - recalculates all the scores from scratch. computation expensive
   * do not over use.
   *
   * rests the user run, score and last updated and calls calcScore to compute the score.
   */
  recalcScore: function (cb) {

    // warning, very destrucitve action upon save.
    // reset everything except drinks.
    this.runs = [];
    this.score = 0;
    this.lastUpdated = BET_START_DATE;

    return this.calcScore(this.drinks, cb);
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
