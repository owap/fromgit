'use strict';

module.exports = {
	db: 'mongodb://localhost/fromgit-test',
	port: 3001,
	app: {
		title: 'fromgit - Test Environment'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	}
};
