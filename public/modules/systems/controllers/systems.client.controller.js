'use strict';

// Systems controller
angular.module('systems').controller('SystemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Systems',
	function($scope, $stateParams, $location, Authentication, Systems) {
		$scope.authentication = Authentication;

		// Create new System
		$scope.create = function() {
			// Create new System object
			var system = new Systems ({
				name: this.name
			});

			// Redirect after save
			system.$save(function(response) {
				$location.path('systems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing System
		$scope.remove = function(system) {
			if ( system ) { 
				system.$remove();

				for (var i in $scope.systems) {
					if ($scope.systems [i] === system) {
						$scope.systems.splice(i, 1);
					}
				}
			} else {
				$scope.system.$remove(function() {
					$location.path('systems');
				});
			}
		};

		// Update existing System
		$scope.update = function() {
			var system = $scope.system;

			system.$update(function() {
				$location.path('systems/' + system._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Systems
		$scope.find = function() {
			$scope.systems = Systems.query();
		};

		// Find existing System
		$scope.findOne = function() {
			$scope.system = Systems.get({ 
				systemId: $stateParams.systemId
			});
		};
	}
]);