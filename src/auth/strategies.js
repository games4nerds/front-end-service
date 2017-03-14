const GitHubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const config = require('../../config.secret');
const { findOrCreate } = require('../services/user-service');

const strategies = [
    new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
    }, verifyUser.bind(null, 'github')),

    new TwitterStrategy({
        consumerKey: config.TWITTER_CLIENT_ID,
        consumerSecret: config.TWIITER_CLIENT_SECRET,
        callbackURL: config.TWITTER_CALLBACK_URL,
    }, verifyUser.bind(null, 'twitter')),

    new FacebookStrategy({
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: config.FACEBOOK_CALLBACK_URL,
    }, verifyUser.bind(null, 'facebook')),

    new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
    }, verifyUser.bind(null, 'google')),
];

strategies.scopes = {
    google: ['https://www.googleapis.com/auth/plus.login']
};

strategies.providers = strategies.map(strategy => strategy.name);

module.exports = strategies;


function verifyUser(provider, accessToken, refreshToken, oauthProfile, done) {
    const formattedUser = formatUser(oauthProfile, provider);

    findOrCreate(formattedUser)
          .then((user) => {
              console.log(user);
              done(null, user);
          });
}

function formatUser(profile, provider) {
    return {
        providerId: profile.id,
        displayName: profile.displayName,
        nickName: profile.username,
        provider,
    };
}