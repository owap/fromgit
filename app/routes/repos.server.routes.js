'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var repos = require('../../app/controllers/repos.server.controller');

	// Repos Routes
	app.route('/repos')
		.get(repos.list)
		.post(users.requiresLogin, repos.create);

	app.route('/repos/:repoId')
		.get(repos.read)
		.put(users.requiresLogin, repos.hasAuthorization, repos.update)
		.delete(users.requiresLogin, repos.hasAuthorization, repos.delete);

	// Finish by binding the Repo middleware
	app.param('repoId', repos.repoByID);
};
