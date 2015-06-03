'use strict';

(function() {
	// Systems Controller Spec
	describe('Systems Controller Tests', function() {
		// Initialize global variables
		var SystemsController,
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

			// Initialize the Systems controller.
			SystemsController = $controller('SystemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one System object fetched from XHR', inject(function(Systems) {
			// Create sample System using the Systems service
			var sampleSystem = new Systems({
				name: 'New System'
			});

			// Create a sample Systems array that includes the new System
			var sampleSystems = [sampleSystem];

			// Set GET response
			$httpBackend.expectGET('systems').respond(sampleSystems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.systems).toEqualData(sampleSystems);
		}));

		it('$scope.findOne() should create an array with one System object fetched from XHR using a systemId URL parameter', inject(function(Systems) {
			// Define a sample System object
			var sampleSystem = new Systems({
				name: 'New System'
			});

			// Set the URL parameter
			$stateParams.systemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/systems\/([0-9a-fA-F]{24})$/).respond(sampleSystem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.system).toEqualData(sampleSystem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Systems) {
			// Create a sample System object
			var sampleSystemPostData = new Systems({
				name: 'New System'
			});

			// Create a sample System response
			var sampleSystemResponse = new Systems({
				_id: '525cf20451979dea2c000001',
				name: 'New System'
			});

			// Fixture mock form input values
			scope.name = 'New System';

			// Set POST response
			$httpBackend.expectPOST('systems', sampleSystemPostData).respond(sampleSystemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the System was created
			expect($location.path()).toBe('/systems/' + sampleSystemResponse._id);
		}));

		it('$scope.update() should update a valid System', inject(function(Systems) {
			// Define a sample System put data
			var sampleSystemPutData = new Systems({
				_id: '525cf20451979dea2c000001',
				name: 'New System'
			});

			// Mock System in scope
			scope.system = sampleSystemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/systems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/systems/' + sampleSystemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid systemId and remove the System from the scope', inject(function(Systems) {
			// Create new System object
			var sampleSystem = new Systems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Systems array and include the System
			scope.systems = [sampleSystem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/systems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSystem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.systems.length).toBe(0);
		}));
	});
}());