'use strict';

//Setting up route
angular.module('systems').config(['$stateProvider',
	function($stateProvider) {
		// Systems state routing
		$stateProvider.
		state('listSystems', {
			url: '/systems',
			templateUrl: 'modules/systems/views/list-systems.client.view.html'
		}).
		state('createSystem', {
			url: '/systems/create',
			templateUrl: 'modules/systems/views/create-system.client.view.html'
		}).
		state('viewSystem', {
			url: '/systems/:systemId',
			templateUrl: 'modules/systems/views/view-system.client.view.html'
		}).
		state('editSystem', {
			url: '/systems/:systemId/edit',
			templateUrl: 'modules/systems/views/edit-system.client.view.html'
		});
	}
]);