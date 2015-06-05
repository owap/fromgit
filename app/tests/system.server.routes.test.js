'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    System = mongoose.model('System'),
    Promise = require('bluebird'),
    agent = request.agent(app);

Promise.promisifyAll(request);
Promise.promisifyAll(agent);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(System);
Promise.promisifyAll(System.prototype);
/**
 * Globals
 */
var credentials, user, system;

/**
 * System routes tests
 */
describe('System CRUD tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new System
        user.saveAsync().then(function() {
            var environments = [
                { name: 'TestEnv1' },
                { name: 'TestEnv2' }
            ];
            system = {
                name: 'System Name',
                environments: environments
            };
        }).then(done).catch(console.error);
    });

    it('should be able to save System instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new System
                agent.post('/systems')
                    .send(system)
                    .expect(200)
                    .end(function(systemSaveErr, systemSaveRes) {
                        // Handle System save error
                        if (systemSaveErr) done(systemSaveErr);

                        // Get a list of Systems
                        agent.get('/systems')
                            .end(function(systemsGetErr, systemsGetRes) {
                                // Handle System save error
                                if (systemsGetErr) done(systemsGetErr);

                                // Get Systems list
                                var systems = systemsGetRes.body;

                                // Set assertions
                                (systems[0].user._id).should.equal(userId);
                                (systems[0].name).should.match('System Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save System instance if not logged in', function(done) {
        agent.post('/systems')
            .send(system)
            .expect(401)
            .end(function(systemSaveErr, systemSaveRes) {
                // Call the assertion callback
                done(systemSaveErr);
            });
    });

    it('should not be able to save System instance if no name is provided', function(done) {
        // Invalidate name field
        system.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new System
                agent.post('/systems')
                    .send(system)
                    .expect(400)
                    .end(function(systemSaveErr, systemSaveRes) {
                        // Set message assertion
                        (systemSaveRes.body.message).should.match('Please fill System name');

                        // Handle System save error
                        done(systemSaveErr);
                    });
            });
    });

    it('should be able to update System instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new System
                agent.post('/systems')
                    .send(system)
                    .expect(200)
                    .end(function(systemSaveErr, systemSaveRes) {
                        // Handle System save error
                        if (systemSaveErr) done(systemSaveErr);

                        // Update System name
                        system.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing System
                        agent.put('/systems/' + systemSaveRes.body._id)
                            .send(system)
                            .expect(200)
                            .end(function(systemUpdateErr, systemUpdateRes) {
                                // Handle System update error
                                if (systemUpdateErr) done(systemUpdateErr);

                                // Set assertions
                                (systemUpdateRes.body._id).should.equal(systemSaveRes.body._id);
                                (systemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Systems if not signed in', function(done) {
        // Create new System model instance
        var systemObj = new System(system);

        // Save the System
        systemObj.save(function() {
            // Request Systems
            request(app).get('/systems')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should not be able to get a single System if not signed in', function(done) {
        // Create new System model instance
        var systemObj = new System(system);

        // Save the System
        systemObj.save(function() {
            request(app).get('/systems/' + systemObj._id)
            .expect(401)
            .end(function(systemDeleteErr, systemDeleteRes) {
                // Set message assertion
                (systemDeleteRes.body.message).should.match('User is not logged in');

                // Handle System error error
                done(systemDeleteErr);
            });
        });
    });

    it('should be able to delete System instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new System
                agent.post('/systems')
                    .send(system)
                    .expect(200)
                    .end(function(systemSaveErr, systemSaveRes) {
                        // Handle System save error
                        if (systemSaveErr) done(systemSaveErr);

                        // Delete existing System
                        agent.delete('/systems/' + systemSaveRes.body._id)
                            .send(system)
                            .expect(200)
                            .end(function(systemDeleteErr, systemDeleteRes) {
                                // Handle System error error
                                if (systemDeleteErr) done(systemDeleteErr);

                                // Set assertions
                                (systemDeleteRes.body._id).should.equal(systemSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete System instance if not signed in', function(done) {
        // Set System user
        system.user = user;

        // Create new System model instance
        var systemObj = new System(system);

        // Save the System
        systemObj.save(function() {
            // Try deleting System
            request(app).delete('/systems/' + systemObj._id)
            .expect(401)
            .end(function(systemDeleteErr, systemDeleteRes) {
                // Set message assertion
                (systemDeleteRes.body.message).should.match('User is not logged in');

                // Handle System error error
                done(systemDeleteErr);
            });

        });
    });

    it('should be able to query environments associated with systems', function(done){
        system.user = user;
        var systemObj = new System(system);
        systemObj.saveAsync().then(function(){
            return agent.post('/auth/signin').send(credentials).expect(200).endAsync();
        })
        .then(function(signinRes){
            return agent.get('/systems/' + systemObj._id +
                             '/environments/' + systemObj.environments[0].name)
            .expect(200).endAsync();
        })
        .then(function(res) {
            res.body.should.be.an.Object.and.have.property('name', 'TestEnv1');
            done();
        })
        .catch(console.error);
    });

    afterEach(function(done) {
        User.remove().exec();
        System.remove().exec();
        done();
    });
});