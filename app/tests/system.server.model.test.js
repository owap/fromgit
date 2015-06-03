'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    System = mongoose.model('System');

var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(System);
Promise.promisifyAll(System.prototype);

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

        user.saveAsync()
        .then(function() {
            system = new System({
                name: 'System Name',
                environments: [{
                    name: 'Test Environment',
                    repos: [{
                        'url': 'http://testURL',
                        'branch': 'master'
                    }]
                }],
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

        it('should be able to get the name of the associated repos', function(done){
            system.saveAsync()
            // Get system object from DB
            .then(function(){
                return System.findByIdAsync(system._id);
            })
            // Assert we can get back the environments and repos
            .then(function(retrievedSystem){
                var environment = retrievedSystem.environments[0];
                should.equal(environment.name, 'Test Environment');
                var repo = environment.repos[0];
                should.equal(repo.url, 'http://testURL');
            }).then(done)
            .catch(function(err){
                console.error('Error asserting System/Env/Repo association:', err);
            });

        });
    });

    afterEach(function(done) {
        System.remove().exec();
        User.remove().exec();
        done();
    });
});