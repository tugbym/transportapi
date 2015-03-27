(function () {
   'use strict';
}());
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
            templateUrl: 'partials/clientregistration.html',
            controller: 'ClientRegistrationController'
        });
        $routeProvider.when('/client', {
            templateUrl: 'partials/client.html',
            controller: 'ClientController'
        });
        $routeProvider.when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'UserSearchController'
        });
        $routeProvider.when('/profile/:userID', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileController'
        });
        $routeProvider.when('/admin', {
            templateUrl: 'partials/admin/admin.html',
            controller: 'AdminController'
        });
        $routeProvider.when('/admin/buses', {
            templateUrl: 'partials/admin/buses.html',
            controller: 'AdminBusController'
        });
        $routeProvider.when('/admin/clients', {
            templateUrl: 'partials/admin/clients.html',
            controller: 'AdminClientController'
        });
        $routeProvider.when('/admin/flights', {
            templateUrl: 'partials/admin/flights.html',
            controller: 'AdminFlightController'
        });
        $routeProvider.when('/admin/trains', {
            templateUrl: 'partials/admin/trains.html',
            controller: 'AdminTrainController'
        });
        $routeProvider.when('/admin/users', {
            templateUrl: 'partials/admin/users.html',
            controller: 'AdminUserController'
        });
        $routeProvider.when('/oauth/authorize/clientID=\:clientID&redirectURI=\:redirectURI&scope=\:scope', {
            templateUrl: 'partials/dialog.html',
            controller: 'DialogController'
        });
        $routeProvider.when('/oauth/token/clientID=\:clientID&clientSecret=\:clientSecret&grantType=authorization_code&redirectURI=\:redirectURI&code=\:code', {
            templateUrl: 'partials/token.html',
            controller: 'TokenController'
        });
    }
]).
factory('AdminService', [
    function() {
        var status = {
            isAdmin: false
        };
        return {
            get: function() {
                return status;
            },
            set: function() {
                status.isAdmin = true;
                return status;
            },
            reset: function() {
                status.isAdmin = false;
                return status;
            }
        };
    }
]).
factory('UserService', [
    function() {
        var status = {
            isLoggedIn: false,
            userID: '',
            username: '',
            transportID: '',
            transportType: '',
            friends: [],
            nonMutualFriends: []
        };
        return {
            get: function() {
                return status;
            },
            set: function(userID, username, transportID, transportType, friends, nonMutual) {
                status.userID = userID;
                status.username = username;
                status.transportID = transportID;
                status.transportType = transportType;
                status.friends = friends;
                status.isLoggedIn = true;
                status.nonMutualFriends = nonMutual;
                return status;
            },
            reset: function() {
                status = {
                    isLoggedIn: false,
                    userID: '',
                    username: '',
                    transportID: '',
                    transportType: '',
                    friends: [],
                    nonMutualFriends: []
                };
                return status;
            }
        };
    }
]).
factory('TokenService', [
    function() {
        var status = {
            hasAccessToken: false,
            accessToken: '',
            refreshToken: '',
            clientID: '',
            clientSecret: ''
        };
        return {
            get: function() {
                return status;
            },
            set: function(access, refresh, clientID, clientSecret) {
                status.hasAccessToken = true;
                status.accessToken = access;
                status.refreshToken = refresh;
                status.clientID = clientID;
                status.clientSecret = clientSecret;
                return status;
            },
            reset: function() {
                status = {
                    hasAccessToken: false,
                    accessToken: '',
                    refreshToken: '',
                    clientID: '',
                    clientSecret: ''
                };
                return status;
            }
        };
    }
]);