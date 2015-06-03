'use strict';

// Repos controller
angular.module('repos').controller('ReposController', ['$scope', '$stateParams', '$location', 'Authentication', 'Repos',
	function($scope, $stateParams, $location, Authentication, Repos) {
		$scope.authentication = Authentication;

		// Create new Repo
		$scope.create = function() {
			// Create new Repo object
			var repo = new Repos ({
				name: this.name
			});

			// Redirect after save
			repo.$save(function(response) {
				$location.path('repos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Repo
		$scope.remove = function(repo) {
			if ( repo ) { 
				repo.$remove();

				for (var i in $scope.repos) {
					if ($scope.repos [i] === repo) {
						$scope.repos.splice(i, 1);
					}
				}
			} else {
				$scope.repo.$remove(function() {
					$location.path('repos');
				});
			}
		};

		// Update existing Repo
		$scope.update = function() {
			var repo = $scope.repo;

			repo.$update(function() {
				$location.path('repos/' + repo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Repos
		$scope.find = function() {
			$scope.repos = Repos.query();
		};

		// Find existing Repo
		$scope.findOne = function() {
			$scope.repo = Repos.get({ 
				repoId: $stateParams.repoId
			});
		};
	}
]);