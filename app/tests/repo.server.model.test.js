'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Repo = mongoose.model('Repo');
    
var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(Repo);
Promise.promisifyAll(Repo.prototype);

/**
 * Globals
 */
var user, repo;

/**
 * Unit tests
 */
describe('Repo Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local'
        });

        user.save(function() { 
            repo = new Repo({
                name: 'Repo Name',
                url: 'http://test-url.com/repo',
                user: user
            });
            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return repo.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) { 
            repo.name = '';

            return repo.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) { 
        Repo.remove().exec();
        User.remove().exec();

        done();
    });
});