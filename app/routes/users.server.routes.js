'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // User Routes
    var users = require('../../app/controllers/users.server.controller');

    // Setting up the users profile api
    app.route('/users/me').get(users.me);
    app.route('/users').put(users.update);
    app.route('/users/accounts').delete(users.removeOAuthProvider);

    // Setting up the users authentication api
    app.route('/auth/signup').post(users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);

    // Setting the github oauth routes
    app.route('/auth/github').get(passport.authenticate('github',
        { scope: ['user', 'read:org'] }
    ));
    app.route('/auth/github/callback').get(users.oauthCallback('github'));

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};