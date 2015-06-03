'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    System = mongoose.model('System'),
    Repo = mongoose.model('Repo');

/**
 * Globals
 */
var user, repo, system;

/**
 * Unit tests
 */
describe('System Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function() {
            system = new System({
                name: 'System Name',
                user: user
            });
			done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return system.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) { 
            system.name = '';

            return system.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) { 
        System.remove().exec();
        User.remove().exec();

        done();
    });
});