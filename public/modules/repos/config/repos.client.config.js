'use strict';

// Configuring the Articles module
angular.module('repos').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Repos', 'repos', 'dropdown', '/repos(/create)?');
        Menus.addSubMenuItem('topbar', 'repos', 'List Repos', 'repos');
        Menus.addSubMenuItem('topbar', 'repos', 'New Repo', 'repos/create');
    }
]);