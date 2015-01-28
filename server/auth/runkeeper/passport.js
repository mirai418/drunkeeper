var passport = require('passport');
var RunKeeperStrategy = require('passport-runkeeper').Strategy;

var runkeeperOptions = require('../../config/runkeeper');

exports.setup = function (User, config) {

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete RunKeeper profile is
  //   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    console.log('serialize');
    // console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      // console.log('--> hey');
      // console.log(user);
      // console.log(err);
      done(err, user);
    });
  });

  passport.use(new RunKeeperStrategy({
      clientID: runkeeperOptions.client_id,
      clientSecret: runkeeperOptions.client_secret,
      callbackURL: runkeeperOptions.redirect_uri
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('passport.use');
      // console.log(profile);
      User.findOrCreate({ runkeeperId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
};
