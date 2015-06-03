'use strict';

//Setting up route
angular.module('repos').config(['$stateProvider',
    function($stateProvider) {
        // Repos state routing
        $stateProvider.
        state('listRepos', {
            url: '/repos',
            templateUrl: 'modules/repos/views/list-repos.client.view.html'
        }).
        state('createRepo', {
            url: '/repos/create',
            templateUrl: 'modules/repos/views/create-repo.client.view.html'
        }).
        state('viewRepo', {
            url: '/repos/:repoId',
            templateUrl: 'modules/repos/views/view-repo.client.view.html'
        }).
        state('editRepo', {
            url: '/repos/:repoId/edit',
            templateUrl: 'modules/repos/views/edit-repo.client.view.html'
        });
    }
]);