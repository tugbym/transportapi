'use strict';
/* Controllers */
angular.module('hydraApp.controllers', []).
controller('MainController', ['UserService', 'TokenService', '$routeParams',
    function(UserService, TokenService, $routeParams) {
        var self = this;
        self.UserService = UserService;
        self.TokenService = TokenService;
        self.code = $routeParams.code;
    }
]).
controller('MapController', ['$http',
    function($http) {
        var self = this;
        self.markers = {};
        //style the map.. so that transit icon is bigger and clearer colour for roads
        var styles = [{
            featureType: 'transit.station',
            elementType: 'labels.icon',
            stylers: [{
                weight: 25
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                hue: '#ffcc33'
            }, {
                lightness: 15
            }]
        }, {
            featureType: 'road.local',
            elementType: 'all',
            stylers: [{
                hue: '#ffd7a6'
            }, {
                saturation: 100
            }, {
                lightness: -12
            }]
        }];
        // Set up the default map:
        // var London = new gooogle.maps.LatLng(51.500926, -0.123961);
        // var BirminghamUK = new google.maps.LatLng(52.477309, -1.896418);
        var Coventry = new google.maps.LatLng(52.406826, -1.504156);
        var mapOptions = {
            zoom: 14,
            center: Coventry,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        self.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // Subscribe to the bus route, and get currently stored data:
        io.socket.get('/api/bus', function(data) {
            var buses = data.collection.items;
            if(buses[0].data[0]) {
                for(var i = 0; i < buses.length; i++) {
                    data = buses[i].data;
                    var latitude,
                        longitude,
                        id,
                        busNumber;
                    for(var j = 0; j < data.length; j++) {
                        if(data[j].name == "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name == "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name == "id") {
                            id = data[j].value;
                        }
                        if(data[j].name == "busNumber") {
                            busNumber = data[j].value;
                        }
                    }
                    var icon = 'img/BusLogo.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Bus number: " + busNumber.toString());
                    marker.setMap(self.map);
                }
            }
        });
        // Subscribe to the train route, and get currently stored data:
        io.socket.get('/api/train', function(data) {
            var trains = data.collection.items;
            if(trains[0].data[0]) {
                for(var i = 0; i < trains.length; i++) {
                    data = trains[i].data;
                    var latitude,
                        longitude,
                        id,
                        trainNumber;
                    for(var j = 0; j < data.length; j++) {
                        if(data[j].name == "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name == "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name == "id") {
                            id = data[j].value;
                        }
                        if(data[j].name == "trainNumber") {
                            trainNumber = data[j].value;
                        }
                    }
                    var icon = 'img/TrainLogo.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Train number: " + trainNumber.toString());
                    marker.setMap(self.map);
                }
            }
        });
        // Subscribe to the flight route, and get currently stored data:
        io.socket.get('/api/flight', function(data) {
            var flights = data.collection.items;
            if(flights[0].data[0]) {
                for(var i = 0; i < flights.length; i++) {
                    data = flights[i].data;
                    var latitude,
                        longitude,
                        id,
                        flightNumber;
                    for(var j = 0; j < data.length; j++) {
                        if(data[j].name == "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name == "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name == "id") {
                            id = data[j].value;
                        }
                        if(data[j].name == "trainNumber") {
                            trainNumber = data[j].value;
                        }
                    }
                    var icon = 'img/PlaneLogo.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Flight number: " + flightNumber.toString());
                    marker.setMap(self.map);
                }
            }
        });
        // Bus Stops
        var url = 'http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.406754&lon=-1.504129&rpp=30';
        $http.get(url).success(function(res) {
            if(!res.error) {
                for(var i = 0; i < res.stops.length; i++) {
                    var myLatlng = new google.maps.LatLng(res.stops[i].latitude, res.stops[i].longitude);
                    var id = res.stops[i].atcocode;
                    var icon = 'img/BusLogo.png';
                    var name = res.stops[i].name;
                    var marker = addMarker(myLatlng, id, icon, name);
                    marker.setMap(self.map);
                }
            } else {
                self.message = res.error;
            }
        }).error(function(err) {
            self.message = "Error" + err;
        });

        function addMarker(location, id, icon, name) {
            var marker = new google.maps.Marker({
                id: id,
                position: location,
                icon: icon,
                map: self.map
            });
            var infowindow = new google.maps.InfoWindow({
                content: name
            });
            google.maps.event.addListener(marker, "click", function() {
                infowindow.open(self.map, marker);
            });
            self.markers[id] = marker;
            return marker;
        }
        // train station
        var urltrain = 'http://transportapi.com/v3/uk/train/stations/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.4103366&lon=-1.5063179';
        $http.get(urltrain).success(function(res) {
            if(!res.error) {
                for(var i = 0; i < res.stations.length; i++) {
                    var myLatlng = new google.maps.LatLng(res.stations[i].latitude, res.stations[i].longitude);
                    var id = res.stations[i].station_code;
                    var icon = 'img/TrainLogo.png';
                    var name = res.stations[i].name;
                    var marker = addMarker(myLatlng, id, icon, name);
                    marker.setMap(self.map);
                }
            } else {
                self.message = res.error;
            }
        }).error(function(err) {
            self.message = "Error" + err;
        });
        // Someone just posted to the bus route, grab that data, and create a new marker.
        io.socket.on('bus', function(bus) {
            if(bus.verb == 'updated') {
                var marker = self.markers[bus.id];
                marker.setMap(null);
                console.log("A bus has been updated");
            }
            if(bus.verb == 'destroyed') {
                var marker = self.markers[bus.id];
                marker.setMap(null);
                console.log("A bus has been deleted");
                return;
            }
            var latitude = bus.data.latitude
            var longitude = bus.data.longitude
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, bus.data.id);
            marker.setMap(self.map);
            console.log("A bus has been created");
        });
        // Someone just posted to the train route, grab that data, and create a new marker.
        io.socket.on('train', function(train) {
            if(train.verb == 'updated') {
                var marker = self.markers[train.id];
                marker.setMap(null);
                console.log("A train has been updated");
            }
            if(train.verb == 'destroyed') {
                var marker = self.markers[train.id];
                marker.setMap(null);
                console.log("A train has been deleted");
                return;
            }
            var latitude = train.data.latitude
            var longitude = train.data.longitude
            console.log('New Train created: ' + train.data.id)
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, train.data.id);
            marker.setMap(self.map);
        });
        // Someone just posted to the flight route, grab that data, and create a new marker.
        io.socket.on('flight', function(flight) {
            if(flight.verb == 'updated') {
                var marker = self.markers[flight.id];
                marker.setMap(null);
                console.log("A bus has been updated");
            }
            if(flight.verb == 'destroyed') {
                var marker = self.markers[flight.id];
                marker.setMap(null);
                console.log("A bus has been deleted");
                return;
            }
            var latitude = flight.data.latitude
            var longitude = flight.data.longitude
            console.log('New Flight created: ' + flight.data.id)
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, flight.data.id);
            marker.setMap(self.map);
        });
        // Add a marker to the map and push to the object.
    }
]).controller('DialogController', ['$http', '$routeParams', '$location',
    function($http, $routeParams, $location) {
        var self = this;
        var clientID = $routeParams.clientID;
        var redirectURI = $routeParams.redirectURI;
        $http.get("/api/oauth/authorize?client_id=" + clientID + "&response_type=code&redirect_uri=" + redirectURI + "&scope=http://fiesta-collect.codio.io:3000").success(function(res) {
            if(!res.transactionID) {
                $location.path('login');
            } else {
                self.success = true;
                self.transactionID = res.transactionID;
                self.user = res.user;
                self.client = res.client;
            }
        }).error(function(res) {
            self.success = false;
        });
        self.allow = function() {
            $http.post('/api/oauth/authorize/decision', {
                transaction_id: self.transactionID
            }).success(function(res) {
                self.message = "We have received your request and will get back to you at the email you provided us.";
                self.authcode = "Authorization Code: " + res.auth_code;
            }).error(function(res) {
                self.message = "There was a problem with your request.";
            });
        }
        self.deny = function() {
            $location.url('/profile/' + self.user.id)
        }
    }
]).controller('LoginController', ['$http', 'UserService', 'AdminService',
    function($http, UserService, AdminService) {
        var self = this;
        self.submit = function() {
            $http.post("/api/login", {
                username: self.username,
                password: self.password
            }).success(function(res) {
                self.message = "Successfully logged in!";
                if(res.user.nickname == 'admin') {
                    AdminService.set();
                }
                UserService.set(res.user);
            }).error(function() {
                self.message = "Incorrect username and/or password.";
            });
        }
    }
]).controller('LogoutController', ['$http', 'UserService', 'AdminService', 'TokenService',
    function($http, UserService, AdminService, TokenService) {
        var self = this;
        $http.get("/api/logout").success(function(res) {
            self.message = "Successfully logged out!";
            UserService.reset();
            AdminService.reset();
            TokenService.reset();
        }).error(function(res) {
            self.message = "Error logging you out.";
        });
    }
]).controller('RegistrationController', ['$http',
    function($http) {
        var self = this;
        self.submit = function() {
            $http.post("/api/user", {
                username: self.username,
                password: self.password,
                name: self.name,
                email: self.email,
                bday: self.bday
            }).success(function(res) {
                self.message = "New account created!";
            }).error(function(res) {
                self.message = "Error creating account.";
            });
        }
    }
]).controller('ProfileController', ['$http', '$routeParams', 'UserService', '$location', 'TokenService', 'AdminService',
    function($http, $routeParams, UserService, $location, TokenService, AdminService) {
        var self = this;
        self.UserService = UserService;
        self.AdminService = AdminService;
        self.userID = $routeParams.userID
        $http.get("/api/user/" + self.userID).success(function(res) {
            self.usersData = res.collection.items[0].data;
        });
        self.getAuthCode = function() {
            $location.url('/oauth/authorize/clientID=' + self.clientID + '&redirectURI=' + self.redirectURI);
        }
        self.getAccessToken = function() {
            $location.url('/oauth/token/clientID=' + self.clientID + '&clientSecret=' + self.clientSecret + '&grantType=authorization_code&redirectURI=' + self.redirectURI + '&code=' + self.code);
        }
        self.setAccessToken = function() {
            TokenService.set(self.accessToken, self.refreshToken, self.clientID, self.clientSecret);
        }
    }
]).controller('ClientRegistrationController', ['$http',
    function($http) {
        var self = this;
        self.success = false;
        self.submit = function() {
            $http.post("/api/client", {
                name: self.name,
                redirectURI: self.redirectURI
            }).success(function(res) {
                self.message = "New client created!";
                self.success = true;
                self.clientID = res.clientId;
                self.clientSecret = res.clientSecret;
            }).error(function(res) {
                self.message = "Error creating client.";
            });
        }
    }
]).controller('ClientController', ['$http', 'TokenService',
    function($http, TokenService) {
        var self = this;
        var clientID = TokenService.get().clientID;
        var clientSecret = TokenService.get().clientSecret;
        // Send a POST request to the bus route through Socket.io:
        self.createNewBus = function() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    io.socket.request({
                        method: "post",
                        url: "/api/bus",
                        params: {
                            arrivalBusStop: self.arrivalBusStop,
                            departureBusStop: self.departureBusStop,
                            arrivalTime: self.arrivalTime,
                            departureTime: self.departureTime,
                            busName: self.busName,
                            busNumber: self.busNumber,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        headers: {
                            "Authorization": "Bearer " + TokenService.get().accessToken
                        }
                    }, function(res) {
                        self.busID = res.busID;
                        console.log("Bus ID: " + res.busID + " has been created.");
                        // Every 10 seconds, refresh the token, and call the updateBus function:
                        setInterval(function() {
                            $http.post("/api/oauth/token", {
                                client_id: clientID,
                                client_secret: clientSecret,
                                grant_type: 'refresh_token',
                                refresh_token: TokenService.get().refreshToken
                            }).success(function(res) {
                                TokenService.set(res.access_token, res.refresh_token, clientID, clientSecret);
                                self.updateBus();
                            }).error(function(res) {
                                console.log("Error refreshing access token.")
                            });
                        }, 10000);
                    })
                })
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
        // Send a PUT request to the bus route through Socket.io:
        self.updateBus = function() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    io.socket.request({
                        method: "put",
                        url: "/api/bus/" + self.busID,
                        params: {
                            arrivalBusStop: self.arrivalBusStop,
                            departureBusStop: self.departureBusStop,
                            arrivalTime: self.arrivalTime,
                            departureTime: self.departureTime,
                            busName: self.busName,
                            busNumber: self.busNumber,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        headers: {
                            "Authorization": "Bearer " + TokenService.get().accessToken
                        }
                    }, function(res) {
                        console.log("Bus has been updated.");
                    })
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
    }
]).controller('SuccessController', [
    function() {
        var self = this;
    }
]).controller('TokenController', ['$http', '$routeParams', 'TokenService',
    function($http, $routeParams, TokenService) {
        var self = this;
        self.success = false;
        self.failure = false;
        var clientID = $routeParams.clientID;
        var clientSecret = $routeParams.clientSecret;
        var redirectURI = $routeParams.redirectURI;
        var code = $routeParams.code;
        $http.post("/api/oauth/token", {
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectURI,
            code: code
        }).success(function(res) {
            self.success = true;
            self.accessToken = res.access_token;
            self.refreshToken = res.refresh_token;
            TokenService.set(res.access_token, res.refresh_token, clientID, clientSecret);
        }).error(function(res) {
            self.failure = true;
        })
    }
]).controller('AdminController', ['AdminService',
    function(AdminService) {
        var self = this;
        self.AdminService = AdminService;
    }
]).controller('AdminBusController', ['AdminService', '$http', 'TokenService',
    function(AdminService, $http, TokenService) {
        var self = this;
        self.AdminService = AdminService;
        self.TokenService = TokenService;
        self.view = function() {
            $http.get('/api/bus').success(function(data) {
                self.buses = data.collection.items;
            });
        }
        self.create = function() {
            io.socket.request({
                method: "post",
                url: "/api/bus",
                params: {
                    arrivalBusStop: self.arrivalBusStop,
                    departureBusStop: self.departureBusStop,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    busName: self.busName,
                    busNumber: self.busNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                console.log("Bus has been created.");
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.update = function() {
            io.socket.request({
                method: "put",
                url: "/api/bus/" + self.busID,
                params: {
                    arrivalBusStop: self.arrivalBusStop,
                    departureBusStop: self.departureBusStop,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    busName: self.busName,
                    busNumber: self.busNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.delete = function() {
            io.socket.request({
                method: "delete",
                url: "/api/bus/" + self.busID,
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
    }
]).controller('AdminClientController', ['AdminService', '$http',
    function(AdminService, $http) {
        var self = this;
        self.AdminService = AdminService;
        self.view = function() {
            $http.get('/api/client').success(function(data) {
                self.clients = data.collection.items;
            });
        }
        self.create = function() {
            $http.post('/api/client', {
                name: self.name,
                redirectURI: self.redirectURI
            }).success(function(res) {
                console.log("Successfully created new client!");
            }).error(function(err) {
                console.log("Error");
            });
        }
        self.update = function() {
            $http.put('/api/client/' + self.clientID, {
                name: self.name,
                redirectURI: self.redirectURI,
                trusted: self.trusted
            }).success(function(res) {
                console.log("Successfully edited client!");
            }).error(function(err) {
                console.log("Error");
            });
        }
        self.delete = function() {
            $http.delete('/api/client/' + self.clientID).success(function(res) {
                console.log("Client successfully deleted!");
            }).error(function(err) {
                console.log("Error");
            });
        }
    }
]).controller('AdminFlightController', ['AdminService', '$http', 'TokenService',
    function(AdminService, $http, TokenService) {
        var self = this;
        self.AdminService = AdminService;
        self.TokenService = TokenService;
        self.view = function() {
            $http.get('/api/flight').success(function(data) {
                self.flights = data.collection.items;
            });
        }
        self.create = function() {
            io.socket.request({
                method: "post",
                url: "/api/flight",
                params: {
                    aircraft: self.aircraft,
                    arrivalAirport: self.arrivalAirport,
                    departureAirport: self.departureAirport,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    flightDistance: self.flightDistance,
                    flightNumber: self.flightNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                console.log("Flight has been created.");
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.update = function() {
            io.socket.request({
                method: "put",
                url: "/api/flight/" + self.flightID,
                params: {
                    aircraft: self.aircraft,
                    arrivalAirport: self.arrivalAirport,
                    departureAirport: self.departureAirport,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    flightDistance: self.flightDistance,
                    flightNumber: self.flightNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.delete = function() {
            io.socket.request({
                method: "delete",
                url: "/api/flight/" + self.flightID,
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
    }
]).controller('AdminTrainController', ['AdminService', '$http', 'TokenService',
    function(AdminService, $http, TokenService) {
        var self = this;
        self.AdminService = AdminService;
        self.TokenService = TokenService;
        self.view = function() {
            $http.get('/api/train').success(function(data) {
                self.trains = data.collection.items;
            });
        }
        self.create = function() {
            io.socket.request({
                method: "post",
                url: "/api/train",
                params: {
                    arrivalPlatform: self.arrivalPlatform,
                    departurePlatform: self.departurePlatform,
                    arrivalStation: self.arrivalStation,
                    departureStation: self.departureStation,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    trainName: self.trainName,
                    trainNumber: self.trainNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                console.log("Train has been created.");
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.update = function() {
            io.socket.request({
                method: "put",
                url: "/api/train/" + self.trainID,
                params: {
                    arrivalPlatform: self.arrivalPlatform,
                    departurePlatform: self.departurePlatform,
                    arrivalStation: self.arrivalStation,
                    departureStation: self.departureStation,
                    arrivalTime: self.arrivalTime,
                    departureTime: self.departureTime,
                    trainName: self.trainName,
                    trainNumber: self.trainNumber,
                    latitude: self.latitude,
                    longitude: self.longitude
                },
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
        self.delete = function() {
            io.socket.request({
                method: "delete",
                url: "/api/train/" + self.trainID,
                headers: {
                    "Authorization": "Bearer " + TokenService.get().accessToken
                }
            }, function(res) {
                $http.post("/api/oauth/token", {
                    client_id: TokenService.get().clientID,
                    client_secret: TokenService.get().clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: TokenService.get().refreshToken
                }).success(function(res) {
                    TokenService.set(res.access_token, res.refresh_token, TokenService.get().clientID, TokenService.get().clientSecret);
                }).error(function(res) {
                    console.log("Error refreshing access token.");
                });
            });
        }
    }
]).controller('AdminUserController', ['AdminService', '$http', 'UserService', 'TokenService',
    function(AdminService, $http, UserService, TokenService) {
        var self = this;
        self.AdminService = AdminService;
        self.view = function() {
            $http.get('/api/user/all').success(function(data) {
                self.users = data.collection.items;
            });
        }
        self.create = function() {
            $http.post('/api/user', {
                username: self.username,
                password: self.password,
                name: self.name,
                email: self.email,
                bday: self.bday
            }).success(function(res) {
                console.log("Successfully created new user!");
            }).error(function(err) {
                console.log("Error");
            });
        }
        self.update = function() {
            $http.put('/api/user/' + self.userID, {
                username: self.username,
                password: self.password,
                name: self.name,
                email: self.email,
                bday: self.bday
            }).success(function(res) {
                console.log("Successfully edited user!");
            }).error(function(err) {
                console.log("Error");
            });
        }
        self.delete = function() {
            $http.delete('/api/user/' + self.userID).success(function(res) {
                console.log("User successfully deleted!");
                if (self.userID == UserService.get().user.id) {
                    UserService.reset();
                    AdminService.reset();
                    TokenService.reset();
                }
            }).error(function(err) {
                console.log("Error");
            });
        }
    }
]);