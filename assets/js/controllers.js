'use strict';
/* Controllers */
angular.module('hydraApp.controllers', []).
controller('MainController', ['UserService',
    function(UserService) {
        var self = this;
        self.UserService = UserService;
    }
]).
controller('MapController', [
    function() {
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
            if(buses[0]) {
                for(var i = 0; i < buses.length; i++) {
                    data = buses[i].data;
                    var latitude,
                        longitude,
                        id;
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
                    }
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id);
                    marker.setMap(self.map);
                }
            }
        });
        // Subscribe to the train route, and get currently stored data:
        io.socket.get('/api/train', function(data) {
            var trains = data.collection.items;
            if(trains[0]) {
                for(var i = 0; i < trains.length; i++) {
                    data = trains[i].data;
                    var latitude,
                        longitude,
                        id;
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
                    }
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id);
                    marker.setMap(self.map);
                }
            }
        });
        // Subscribe to the flight route, and get currently stored data:
        io.socket.get('/api/flight', function(data) {
            var flights = data.collection.items;
            if(flights[0]) {
                for(var i = 0; i < flights.length; i++) {
                    data = flights[i].data;
                    var latitude,
                        longitude,
                        id;
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
                    }
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id);
                    marker.setMap(self.map);
                }
            }
        });
        // Bus Stops
        // 
        // 
        var xmlhttp;
        if(window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest()
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                response = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", "http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.406754&lon=-1.504129", true);
        xmlhttp.send();
        //Event listener - ends a post request to a url specified
        io.socket.post('/busStop', function(busStop) {
            if(busStop.verb == 'updated') {
                console.log("Updated " + busStop.id + " with latitude: " + busStop.data.latitude + " and longitude: " + busStop.data.longitude);
            }
            var latitude = busStop.data.latitude
            var longitude = busStop.data.longitude
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            addMarker(myLatlng);
        });
        // End of Bus Stops
        // 
        // 
        // Someone just posted to the bus route, grab that data, and create a new marker.
        io.socket.on('bus', function(bus) {
            if(bus.verb == 'updated') {
                var marker = self.markers[bus.id];
                marker.setMap(null);
            }
            var latitude = bus.data.latitude
            var longitude = bus.data.longitude
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, bus.data.id);
            marker.setMap(self.map);
        });
        // Someone just posted to the train route, grab that data, and create a new marker.
        io.socket.on('train', function(train) {
            var latitude = train.data.latitude
            var longitude = train.data.longitude
            console.log('New Train created: ' + train.data.id)
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, train.data.id);
            marker.setMap(self.map);
        });
        // Someone just posted to the flight route, grab that data, and create a new marker.
        io.socket.on('flight', function(flight) {
            var latitude = flight.data.latitude
            var longitude = flight.data.longitude
            console.log('New Flight created: ' + flight.data.id)
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker = addMarker(myLatlng, flight.data.id);
            marker.setMap(self.map);
        });
        // Add a marker to the map and push to the object.

        function addMarker(location, id) {
            var marker = new google.maps.Marker({
                id: id,
                position: location,
                map: self.map
            });
            self.markers[id] = marker;
            return marker;
        }
        // Send a POST request to the bus route through Socket.io:
        self.createNewBus = function() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    io.socket.post('/api/bus', {
                        arrivalBusStop: self.arrivalBusStop,
                        departureBusStop: self.departureBusStop,
                        arrivalTime: self.arrivalTime,
                        departureTime: self.departureTime,
                        busName: self.busName,
                        busNumber: self.busNumber,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, function(res, err) {
                        self.busID = res.busID;
                        console.log("Bus ID: " + res.busID + " has been created.");
                        // Every 10 seconds, call the updateBus function:
                        setInterval(function() {
                            self.updateBus();
                        }, 10000);
                    });
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
        // Send a PUT request to the bus route through Socket.io:
        self.updateBus = function() {
            console.log(self.busID);
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    io.socket.put('/api/bus/' + self.busID, {
                        arrivalBusStop: self.arrivalBusStop,
                        departureBusStop: self.departureBusStop,
                        arrivalTime: self.arrivalTime,
                        departureTime: self.departureTime,
                        busName: self.busName,
                        busNumber: self.busNumber,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, function(res) {
                        console.log("Bus ID: " + res.busID + " has been updated.");
                    });
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
        self.createNewFlight = function() {
            io.socket.post('/api/flight', {
                arrivalTime: "2015/02/17 10:00",
                latitude: '10.10',
                longitude: '20.20',
                departureTime: "2015/02/17 03:00"
            });
        }
        self.createNewTrain = function() {
            io.socket.post('/api/train', {
                arrivalTime: "2015/02/17 10:00",
                latitude: '20.10',
                longitude: '30.20',
                departureTime: "2015/02/17 03:00"
            });
        }
    }
]).controller('DialogController', ['$http', '$routeParams', '$location',
    function($http, $routeParams, $location) {
        var self = this;
        self.success = false;
        self.failure = false;
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
            self.failure = true;
        });
        
        self.deny = function() {
            $location.url('/profile/' + self.user.id)
        }
    }
]).controller('LoginController', ['$http', 'UserService',
    function($http, UserService) {
        var self = this;
        self.submit = function() {
            $http.post("/api/login", {
                username: self.username,
                password: self.password
            }).success(function(res) {
                self.message = "Successfully logged in!";
                UserService.set(res.user);
            }).error(function() {
                self.message = "Incorrect username and/or password.";
            });
        }
    }
]).controller('LogoutController', ['$http', 'UserService',
    function($http, UserService) {
        var self = this;
        $http.get("/api/logout").success(function(res) {
            self.message = "Successfully logged out!";
            UserService.reset();
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
                console.log(res);
                self.message = "Error creating account.";
            });
        }
    }
]).controller('ProfileController', ['$http', '$routeParams', 'UserService', '$location',
    function($http, $routeParams, UserService, $location) {
        var self = this;
        self.UserService = UserService;
        self.userID = $routeParams.userID
        $http.get("/api/user/" + self.userID).success(function(res) {
            self.usersData = res.collection.items[0].data;
        });
        self.submit = function() {
            $location.url('/oauth/authorize/clientID=' + self.clientID + '&redirectURI=' + self.redirectURI);
        }
    }
]).controller('ClientController', ['$http',
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
]).controller('SuccessController', ['$routeParams',
    function($routeParams) {
        var self = this;
        self.code = $routeParams.code;
        if (code) {
            self.success = true;
        }
    }
]);