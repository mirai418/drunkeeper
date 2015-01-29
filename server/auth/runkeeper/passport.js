var passport = require('passport');
var RunKeeperStrategy = require('passport-runkeeper').Strategy;

var runkeeperClient = require('../../config/runkeeper');

exports.setup = function (User, config) {

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete RunKeeper profile is
  //   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new RunKeeperStrategy({
      clientID: runkeeperClient.client_id,
      clientSecret: runkeeperClient.client_secret,
      callbackURL: runkeeperClient.redirect_uri
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ runkeeperId: profile.id }, function (err, user) {
        user.accessToken = accessToken;

        user.computeNewScore(function (success) {
        });

        if (!user.name) {
          user.getRunkeeperName(function (success) {
            return done(success, user);
          })
        } else {
          user.save(function(err) {
            return done(err, user);
          });
        }

      });
    }
  ));
};
