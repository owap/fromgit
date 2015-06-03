'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Repo = mongoose.model('Repo'),
	_ = require('lodash');

/**
 * Create a Repo
 */
exports.create = function(req, res) {
	var repo = new Repo(req.body);
	repo.user = req.user;

	repo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repo);
		}
	});
};

/**
 * Show the current Repo
 */
exports.read = function(req, res) {
	res.jsonp(req.repo);
};

/**
 * Update a Repo
 */
exports.update = function(req, res) {
	var repo = req.repo ;

	repo = _.extend(repo , req.body);

	repo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repo);
		}
	});
};

/**
 * Delete an Repo
 */
exports.delete = function(req, res) {
	var repo = req.repo ;

	repo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repo);
		}
	});
};

/**
 * List of Repos
 */
exports.list = function(req, res) { 
	Repo.find().sort('-created').populate('user', 'displayName').exec(function(err, repos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repos);
		}
	});
};

/**
 * Repo middleware
 */
exports.repoByID = function(req, res, next, id) { 
	Repo.findById(id).populate('user', 'displayName').exec(function(err, repo) {
		if (err) return next(err);
		if (! repo) return next(new Error('Failed to load Repo ' + id));
		req.repo = repo ;
		next();
	});
};

/**
 * Repo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.repo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
