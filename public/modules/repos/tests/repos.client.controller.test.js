'use strict';

(function() {
	// Repos Controller Spec
	describe('Repos Controller Tests', function() {
		// Initialize global variables
		var ReposController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Repos controller.
			ReposController = $controller('ReposController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Repo object fetched from XHR', inject(function(Repos) {
			// Create sample Repo using the Repos service
			var sampleRepo = new Repos({
				name: 'New Repo'
			});

			// Create a sample Repos array that includes the new Repo
			var sampleRepos = [sampleRepo];

			// Set GET response
			$httpBackend.expectGET('repos').respond(sampleRepos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.repos).toEqualData(sampleRepos);
		}));

		it('$scope.findOne() should create an array with one Repo object fetched from XHR using a repoId URL parameter', inject(function(Repos) {
			// Define a sample Repo object
			var sampleRepo = new Repos({
				name: 'New Repo'
			});

			// Set the URL parameter
			$stateParams.repoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/repos\/([0-9a-fA-F]{24})$/).respond(sampleRepo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.repo).toEqualData(sampleRepo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Repos) {
			// Create a sample Repo object
			var sampleRepoPostData = new Repos({
				name: 'New Repo'
			});

			// Create a sample Repo response
			var sampleRepoResponse = new Repos({
				_id: '525cf20451979dea2c000001',
				name: 'New Repo'
			});

			// Fixture mock form input values
			scope.name = 'New Repo';

			// Set POST response
			$httpBackend.expectPOST('repos', sampleRepoPostData).respond(sampleRepoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Repo was created
			expect($location.path()).toBe('/repos/' + sampleRepoResponse._id);
		}));

		it('$scope.update() should update a valid Repo', inject(function(Repos) {
			// Define a sample Repo put data
			var sampleRepoPutData = new Repos({
				_id: '525cf20451979dea2c000001',
				name: 'New Repo'
			});

			// Mock Repo in scope
			scope.repo = sampleRepoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/repos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/repos/' + sampleRepoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid repoId and remove the Repo from the scope', inject(function(Repos) {
			// Create new Repo object
			var sampleRepo = new Repos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Repos array and include the Repo
			scope.repos = [sampleRepo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/repos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRepo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.repos.length).toBe(0);
		}));
	});
}());