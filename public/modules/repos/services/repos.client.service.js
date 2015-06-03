'use strict';

//Repos service used to communicate Repos REST endpoints
angular.module('repos').factory('Repos', ['$resource',
	function($resource) {
		return $resource('repos/:repoId', { repoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);