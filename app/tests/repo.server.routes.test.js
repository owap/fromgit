'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Repo = mongoose.model('Repo'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, repo;

/**
 * Repo routes tests
 */
describe('Repo CRUD tests', function() {
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

        // Save a user to the test db and create new Repo
        user.save(function() {
            repo = {
                name: 'Repo Name',
                url: 'http://test-url.com/repo'
            };

            done();
        });
    });

    it('should be able to save Repo instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Repo
                agent.post('/repos')
                    .send(repo)
                    .expect(200)
                    .end(function(repoSaveErr, repoSaveRes) {
                        // Handle Repo save error
                        if (repoSaveErr) done(repoSaveErr);

                        // Get a list of Repos
                        agent.get('/repos')
                            .end(function(reposGetErr, reposGetRes) {
                                // Handle Repo save error
                                if (reposGetErr) done(reposGetErr);

                                // Get Repos list
                                var repos = reposGetRes.body;

                                // Set assertions
                                (repos[0].user._id).should.equal(userId);
                                (repos[0].name).should.match('Repo Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Repo instance if not logged in', function(done) {
        agent.post('/repos')
            .send(repo)
            .expect(401)
            .end(function(repoSaveErr, repoSaveRes) {
                // Call the assertion callback
                done(repoSaveErr);
            });
    });

    it('should not be able to save Repo instance if no name is provided', function(done) {
        // Invalidate name field
        repo.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Repo
                agent.post('/repos')
                    .send(repo)
                    .expect(400)
                    .end(function(repoSaveErr, repoSaveRes) {
                        // Set message assertion
                        (repoSaveRes.body.message).should.match('Please fill Repository name');
                        
                        // Handle Repo save error
                        done(repoSaveErr);
                    });
            });
    });

    it('should be able to update Repo instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Repo
                agent.post('/repos')
                    .send(repo)
                    .expect(200)
                    .end(function(repoSaveErr, repoSaveRes) {
                        // Handle Repo save error
                        if (repoSaveErr) done(repoSaveErr);

                        // Update Repo name
                        repo.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Repo
                        agent.put('/repos/' + repoSaveRes.body._id)
                            .send(repo)
                            .expect(200)
                            .end(function(repoUpdateErr, repoUpdateRes) {
                                // Handle Repo update error
                                if (repoUpdateErr) done(repoUpdateErr);

                                // Set assertions
                                (repoUpdateRes.body._id).should.equal(repoSaveRes.body._id);
                                (repoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Repos if not signed in', function(done) {
        // Create new Repo model instance
        var repoObj = new Repo(repo);

        // Save the Repo
        repoObj.save(function() {
            // Request Repos
            request(app).get('/repos')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Repo if not signed in', function(done) {
        // Create new Repo model instance
        var repoObj = new Repo(repo);

        // Save the Repo
        repoObj.save(function() {
            request(app).get('/repos/' + repoObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', repo.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Repo instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Repo
                agent.post('/repos')
                    .send(repo)
                    .expect(200)
                    .end(function(repoSaveErr, repoSaveRes) {
                        // Handle Repo save error
                        if (repoSaveErr) done(repoSaveErr);

                        // Delete existing Repo
                        agent.delete('/repos/' + repoSaveRes.body._id)
                            .send(repo)
                            .expect(200)
                            .end(function(repoDeleteErr, repoDeleteRes) {
                                // Handle Repo error error
                                if (repoDeleteErr) done(repoDeleteErr);

                                // Set assertions
                                (repoDeleteRes.body._id).should.equal(repoSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Repo instance if not signed in', function(done) {
        // Set Repo user 
        repo.user = user;

        // Create new Repo model instance
        var repoObj = new Repo(repo);

        // Save the Repo
        repoObj.save(function() {
            // Try deleting Repo
            request(app).delete('/repos/' + repoObj._id)
            .expect(401)
            .end(function(repoDeleteErr, repoDeleteRes) {
                // Set message assertion
                (repoDeleteRes.body.message).should.match('User is not logged in');

                // Handle Repo error error
                done(repoDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Repo.remove().exec();
        done();
    });
});