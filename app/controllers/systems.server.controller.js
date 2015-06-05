'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    System = mongoose.model('System'),
    _ = require('lodash');

/**
 * Create a System
 */
exports.create = function(req, res) {
    var system = new System(req.body);
    system.user = req.user;

    system.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(system);
        }
    });
};

/**
 * Show the current System
 */
exports.read = function(req, res) {
    res.jsonp(req.system);
};

/**
 * Update a System
 */
exports.update = function(req, res) {
    var system = req.system ;

    system = _.extend(system , req.body);

    system.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(system);
        }
    });
};

/**
 * Delete an System
 */
exports.delete = function(req, res) {
    var system = req.system ;

    system.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(system);
        }
    });
};

/**
 * List of Systems
 */
exports.list = function(req, res) {
    System.find().sort('-created').populate('user', 'displayName').exec(function(err, systems) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(systems);
        }
    });
};

exports.getEnvironment = function(req, res){
    res.jsonp(req.environment);
};

/**
 * System middleware
 */
exports.systemByID = function(req, res, next, id) {
    System.findById(id).populate('user', 'displayName').exec(function(err, system) {
        if (err) return next(err);
        if (! system) return next(new Error('Failed to load System ' + id));
        req.system = system;
        next();
    });
};
exports.environmentByName = function(req, res, next, envName) {
    var environments = req.system.environments;
    var filteredEnviornments = environments ?
        _.filter(environments, function(env){ return env.name === envName; }) :
        [];
    req.environment = filteredEnviornments[0] || [];
    next();
};

/**
 * System authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.system.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
