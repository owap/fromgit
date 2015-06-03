'use strict';

//Systems service used to communicate Systems REST endpoints
angular.module('systems').factory('Systems', ['$resource',
	function($resource) {
		return $resource('systems/:systemId', { systemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);