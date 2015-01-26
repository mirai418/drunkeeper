// Require RunKeeper.js
var runkeeper = require('runkeeper-js');
var passport = require('passport');

// Set up your client's options
var options = {

    // Client ID (Required): 
    // This value is the OAuth 2.0 client ID for your application.  
    client_id : "609fbfd328a84f4e9773adfb8cf9f824",

    // Client Secret (Required):  
    // This value is the OAuth 2.0 shared secret for your application.   
    client_secret : "cf21c82d44d741a5ab42356f0a8e4326",

    // Authorization URL (Optional, default will work for most apps):
    // This is the URL to which your application should redirect the user in order to authorize access to his or her RunKeeper account.   
    auth_url : "https://runkeeper.com/apps/authorize",

    // Access Token URL (Optional, default will work for most apps):
    // This is the URL at which your application can convert an authorization code to an access token. 
    access_token_url : "https://runkeeper.com/apps/token",

    // Redirect URI (Optional but defaults to null, which means your app won't be able to use the getNewToken method):
    // This is the URL that RK sends user to after successful auth  
    // URI naming based on Runkeeper convention 
    redirect_uri : "/auth/runkeeper/callback",

    // Access Token (Optional, defaults to null):
    // When doing Client API Calls on behalf of a specific user (and not getting a new Access Token for the first time), set the user's Access Token here.
    // access_token : "< access token >",

    // API Domain (Optional, default will work for most apps):
    // This is the FQDN (Fully qualified domain name) that is used in making API calls
    api_domain : "api.runkeeper.com"
};

// Create a Client
var client = new runkeeper.HealthGraph(options);

module.exports = options;

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
