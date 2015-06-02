'use strict';

module.exports = {
    db: 'mongodb://localhost/fromgit-dev',
    app: {
        title: 'fromgit - Development Environment'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/auth/github/callback'
    }
};
