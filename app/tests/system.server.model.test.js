'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    System = mongoose.model('System'),
    Repo = mongoose.model('Repo');

var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(System);
Promise.promisifyAll(System.prototype);
Promise.promisifyAll(Repo);
Promise.promisifyAll(Repo.prototype);

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
            password: 'password',
            provider: 'local'
        });

        user.saveAsync().then(function(){
            repo = new Repo({
                name: 'Repo Name',
                url: 'http://test-url.com/repo',
                user: user
            });
            return repo.saveAsync();
        })
        .then(function() {
            system = new System({
                name: 'System Name',
                user: user
            });
        }).then(done)
        .catch(function(err, msg){
            console.error('Failed to stand up System model unit tests:', err);
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
        Repo.remove().exec();

        done();
    });
});