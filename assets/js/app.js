'use strict';
angular.module('hydraApp', ['ngRoute', 'hydraApp.controllers']).
config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/map.html',
            controller: 'MapController'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        });
        $routeProvider.when('/oauth/authorize/clientID=\:clientID&redirectURI=\:redirectURI', {
            templateUrl: 'partials/dialog.html',
            controller: 'DialogController'
        });
    }
]).
factory('UserService', [
    function() {
        var status = {
            isLoggedIn: false,
            username: ''
        }
        return {
            get: function() {
                return status;
            },
            set: function(currentUser, currentID) {
                status.username = currentUser;
                status.ID = currentID;
                status.isLoggedIn = true;
                return status;
            },
            reset: function() {
                status = {
                    isLoggedIn: false,
                    username: ''
                }
                return status;
            }
        };
    }
]);