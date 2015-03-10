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
        $routeProvider.when('/logout', {
            templateUrl: 'partials/logout.html',
            controller: 'LogoutController'
        });
        $routeProvider.when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegistrationController'
        });
        $routeProvider.when('/createClient', {
            templateUrl: 'partials/createClient.html',
            controller: 'ClientController'
        });
        $routeProvider.when('/profile/:userID', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileController'
        });
        $routeProvider.when('/oauth/authorize/clientID=\:clientID&redirectURI=\:redirectURI', {
            templateUrl: 'partials/dialog.html',
            controller: 'DialogController'
        });
        $routeProvider.when('/success\?code=\:code', {
            templateUrl: 'partials/dialogSuccess',
            controller: 'SuccessController'
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
            set: function(user) {
                status.user = user;
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