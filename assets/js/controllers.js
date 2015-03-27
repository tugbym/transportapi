(function () {
   'use strict';
}());
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
controller('MapController', ['$http', '$compile', '$scope', 'UserService',
    function($http, $compile, $scope, UserService) {
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
                        if(data[j].name === "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name === "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name === "id") {
                            id = data[j].value;
                        }
                        if(data[j].name === "busNumber") {
                            busNumber = data[j].value;
                        }
                    }
                    var icon = 'img/bus.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Bus number: " + busNumber.toString(), "bus");
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
                        if(data[j].name === "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name === "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name === "id") {
                            id = data[j].value;
                        }
                        if(data[j].name === "trainNumber") {
                            trainNumber = data[j].value;
                        }
                    }
                    var icon = 'img/train.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Train number: " + trainNumber.toString(), "train");
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
                        if(data[j].name === "latitude") {
                            latitude = data[j].value;
                        }
                        if(data[j].name === "longitude") {
                            longitude = data[j].value;
                        }
                        if(data[j].name === "id") {
                            id = data[j].value;
                        }
                        if(data[j].name === "trainNumber") {
                            trainNumber = data[j].value;
                        }
                    }
                    var icon = 'img/plane.png';
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var marker = addMarker(myLatlng, id, icon, "Flight number: " + flightNumber.toString(), "flight");
                    marker.setMap(self.map);
                }
            }
            addUserMarkers();
        });
        // Get Bus Stops
        var url = 'http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.406754&lon=-1.504129&rpp=30';
        $http.get(url).success(function(res) {
            if(!res.error) {
                for(var i = 0; i < res.stops.length; i++) {
                    var myLatlng = new google.maps.LatLng(res.stops[i].latitude, res.stops[i].longitude);
                    var id = res.stops[i].atcocode;
                    var icon = 'img/bus.png';
                    var name = res.stops[i].name;
                    var marker = addMarker(myLatlng, id, icon, name, null);
                    marker.setMap(self.map);
                }
            } else {
                self.message = res.error;
            }
        }).error(function(err) {
            self.message = "Error" + err;
        });
        // Get Train Stations
        var urltrain = 'http://transportapi.com/v3/uk/train/stations/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.4103366&lon=-1.5063179';
        $http.get(urltrain).success(function(res) {
            if(!res.error) {
                for(var i = 0; i < res.stations.length; i++) {
                    var myLatlng = new google.maps.LatLng(res.stations[i].latitude, res.stations[i].longitude);
                    var id = res.stations[i].station_code;
                    var icon = 'img/train.png';
                    var name = res.stations[i].name;
                    var marker = addMarker(myLatlng, id, icon, name, null);
                    marker.setMap(self.map);
                }
            } else {
                self.message = res.error;
            }
        }).error(function(err) {
            self.message = "Error" + err;
        });
        //Add a marker to the map

        function addMarker(location, id, icon, name, type) {
            var marker = new google.maps.Marker({
                id: id,
                name: name,
                position: location,
                people: [],
                icon: icon,
                map: self.map
            });
            var infowindow;
            if(type == null) {
                infowindow = new google.maps.InfoWindow({
                    content: name
                });
            } else {
                var text = "<p>" + name;
                if(UserService.get().isLoggedIn) {
                    text = text + "<br><button ng-click='addToTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                }
                var compiled = $compile(text)($scope);
                infowindow = new google.maps.InfoWindow({
                    content: compiled[0]
                });
            }
            google.maps.event.addListener(marker, "click", function() {
                infowindow.open(self.map, marker);
            });
            google.maps.event.addListener(self.map, 'click', function() {
                infowindow.close();
            });
            self.markers[id] = marker;
            return marker;
        }

        function updateMarker(location, id, icon, name, type) {
            var people = self.markers[id].people;
            var marker = new google.maps.Marker({
                id: id,
                name: name,
                position: location,
                people: people,
                icon: icon,
                map: self.map
            });
            var text = "<p>" + name;
            var friends = "Currently on board: ";
            for(var i = 0; i < self.markers[id].people.length; i++) {
                friends = friends + self.markers[id].people[i];
                if(i < self.markers[transportID].people.length - 1) {
                    friends = friends + ", ";
                } else {
                    friends = friends + ".";
                }
            }
            if(UserService.get().isLoggedIn) {
                if(self.markers[id].people.indexOf(UserService.get().userID)) {
                    text = text + "<br>" + friends + "<button ng-click='deleteFromTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Delete Me</button></p>";
                } else {
                    text = text + "<br>" + friends + "<button ng-click='addToTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                }
            } else {
                text = text + "<br>" + friends + "</p>";
            }
            var compiled = $compile(text)($scope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });
            google.maps.event.addListener(marker, "click", function() {
                infowindow.open(self.map, marker);
            });
            google.maps.event.addListener(self.map, 'click', function() {
                infowindow.close();
            });
            self.markers[id] = marker;
            return marker;
        }

        function addUserMarkers() {
            if(UserService.get().isLoggedIn) {
                //Add current user to marker
                if(UserService.get().transportID) {
                    var user = UserService.get().username;
                    var transportID = UserService.get().transportID;
                    var transportType = UserService.get().transportType;
                    var marker = self.markers[transportID];
                    self.markers[transportID].people.push(user);
                    var onBoard = "Currently on board: " + user,
                        text;
                    google.maps.event.clearListeners(marker, "click");
                    text = "<p>" + marker.name + "<br>" + onBoard + "<br><button ng-click='deleteFromTransport(" + "\"" + transportID + "\"" + ", " + "\"" + transportType + "\"" + ")'>Delete Me</button></p>";
                    var compiled = $compile(text)($scope);
                    var infowindow = new google.maps.InfoWindow({
                        content: compiled[0]
                    });
                    google.maps.event.addListener(marker, "click", function() {
                        infowindow.open(self.map, marker);
                    });
                    google.maps.event.addListener(self.map, "click", function() {
                        infowindow.close();
                    });
                }
                //Add logged in users friends to markers
                var friends = UserService.get().friends;
                for(var i = 0; i < friends.length; i++) {
                    var friendsName = Object.keys(friends[i])[i];
                    $http.get('/api/user/' + friends[i][friendsName]).success(function(res) {
                        var transports = res.collection.items[0].links;
                        for(var j = 0; j < transports.length; j++) {
                            if(transports[j].rel === "item") {
                                var transport = transports[j].href,
                                    transportID,
                                    marker,
                                    type;
                                if(transport.indexOf("bus") !== -1) {
                                    transportID = transport.split("bus/").pop();
                                    marker = self.markers[transportID];
                                    type = "bus";
                                } else if(transport.indexOf("train") !== -1) {
                                    transportID = transport.split("train/").pop();
                                    marker = self.markers[transportID];
                                    type = "train";
                                } else if(transport.indexOf("flight") !== -1) {
                                    transportID = transport.split("flight/").pop();
                                    marker = self.markers[transportID];
                                    type = "flight";
                                }
                                self.markers[transportID].people.push(friendsName);
                                var friends = "Currently on board: ";
                                for(var i = 0; i < self.markers[transportID].people.length; i++) {
                                    friends = friends + self.markers[transportID].people[i];
                                    if(i < self.markers[transportID].people.length - 1) {
                                        friends = friends + ", ";
                                    } else {
                                        friends = friends + ".";
                                    }
                                }
                                google.maps.event.clearListeners(marker, "click");
                                var text = "<p>" + marker.name + "<br>" + friends + "<br>";
                                if(UserService.get().transportID === transportID) {
                                    text = text + "<button ng-click='deleteFromTransport(" + "\"" + transportID + "\"" + ", " + "\"" + type + "\"" + ")'>Delete Me</button></p>";
                                } else {
                                    text = text + "<button ng-click='addToTransport(" + "\"" + transportID + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                                }
                                var compiled = $compile(text)($scope);
                                var infowindow = new google.maps.InfoWindow({
                                    content: compiled[0]
                                });
                                google.maps.event.addListener(marker, "click", function() {
                                    infowindow.open(self.map, marker);
                                });
                                google.maps.event.addListener(self.map, 'click', function() {
                                    infowindow.close();
                                });
                            }
                        }
                    });
                }
            }
        }
        //Add logged in user to transport
        $scope.addToTransport = function(id, type) {
            $http.put('/api/user/' + type + '/' + id).success(function(res) {
                var marker = self.markers[id];
                google.maps.event.clearListeners(marker, "click");
                self.markers[id].people.push(UserService.get().username);
                var text;
                var friends = "Currently on board: ";
                for(var i = 0; i < self.markers[id].people.length; i++) {
                    friends = friends + self.markers[id].people[i];
                    if(i < self.markers[id].people.length - 1) {
                        friends = friends + ", ";
                    } else {
                        friends = friends + ".";
                    }
                }
                if(type === "bus") {
                    text = "<p>Bus number: " + res.busNumber + "<br>" + friends + "<br><button ng-click='deleteFromTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Delete Me</button></p>";
                }
                if(type === "train") {
                    text = "<p>Train number: " + res.trainNumber + "<br>" + friends + "<br><button ng-click='deleteFromTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Delete Me</button></p>";
                }
                if(type === "flight") {
                    text = "<p>Flight number: " + res.flightNumber + "<br>" + friends + "<br><button ng-click='deleteFromTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Delete Me</button></p>";
                }
                var compiled = $compile(text)($scope);
                var infowindow = new google.maps.InfoWindow({
                    content: compiled[0]
                });
                google.maps.event.addListener(marker, "click", function() {
                    infowindow.open(self.map, marker);
                });
                google.maps.event.addListener(self.map, 'click', function() {
                    infowindow.close();
                });
            });
        };
        //Delete logged in user from transport
        $scope.deleteFromTransport = function(id, type) {
            $http.delete('/api/user/' + type + '/' + id).success(function(res) {
                var marker = self.markers[id];
                google.maps.event.clearListeners(marker, "click");
                var i;
                for(i = 0; i < self.markers[id].people.length; i++) {
                    if(self.markers[id].people[i] === UserService.get().username) {
                        self.markers[id].people.splice(i, 1);
                    }
                }
                var text,
                    friends;
                if(self.markers[id].people[0]) {
                    friends = "Currently on board: ";
                    for(i = 0; i < self.markers[id].people.length; i++) {
                        friends = friends + self.markers[id].people[i];
                        if(i < self.markers[id].people.length - 1) {
                            friends = friends + ", ";
                        } else {
                            friends = friends + ".";
                        }
                    }
                } else {
                    friends = "Nobody currently on board.";
                }
                if(type === "bus") {
                    text = "<p>Bus number: " + res.busNumber + "<br>" + friends + "<br><button ng-click='addToTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                }
                if(type === "train") {
                    text = "<p>Train number: " + res.trainNumber + "<br>" + friends + "<br><button ng-click='addToTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                }
                if(type === "flight") {
                    text = "<p>Flight number: " + res.flightNumber + "<br>" + friends + "<br><button ng-click='addToTransport(" + "\"" + id + "\"" + ", " + "\"" + type + "\"" + ")'>Add Me</button></p>";
                }
                var compiled = $compile(text)($scope);
                var infowindow = new google.maps.InfoWindow({
                    content: compiled[0]
                });
                google.maps.event.addListener(marker, "click", function() {
                    infowindow.open(self.map, marker);
                });
                google.maps.event.addListener(self.map, 'click', function() {
                    infowindow.close();
                });
            });
        };
        // Someone just posted to the bus route, grab that data, and create a new marker.
        io.socket.on('bus', function(bus) {
            var latitude = bus.data.latitude;
            var longitude = bus.data.longitude;
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var icon = 'img/bus.png';
            var marker;
            if(bus.verb === 'updated') {
                marker = self.markers[bus.id];
                marker.setMap(null);
                console.log("A bus has been updated");
                marker = updateMarker(myLatlng, bus.data.id, icon, "Bus number: " + bus.data.busNumber.toString(), "bus");
                marker.setMap(self.map);
                return;
            }
            if(bus.verb === 'destroyed') {
                marker = self.markers[bus.id];
                marker.setMap(null);
                console.log("A bus has been deleted");
                return;
            }
            marker = addMarker(myLatlng, bus.data.id, icon, "Bus number: " + bus.data.busNumber.toString(), "bus");
            marker.setMap(self.map);
            console.log("A bus has been created");
        });
        // Someone just posted to the train route, grab that data, and create a new marker.
        io.socket.on('train', function(train) {
            var latitude = train.data.latitude;
            var longitude = train.data.longitude;
            var icon = 'img/train.png';
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker;
            if(train.verb === 'updated') {
                marker = self.markers[train.id];
                marker.setMap(null);
                console.log("A train has been updated");
                marker = updateMarker(myLatlng, bus.data.id, icon, "Train number: " + train.data.trainNumber.toString(), "train");
                marker.setMap(self.map);
                return;
            }
            if(train.verb === 'destroyed') {
                marker = self.markers[train.id];
                marker.setMap(null);
                console.log("A train has been deleted");
                return;
            }
            marker = addMarker(myLatlng, train.data.id, icon, "Train number: " + train.data.trainNumber.toString(), "train");
            marker.setMap(self.map);
            console.log("A train has been created");
        });
        // Someone just posted to the flight route, grab that data, and create a new marker.
        io.socket.on('flight', function(flight) {
            var latitude = flight.data.latitude;
            var longitude = flight.data.longitude;
            var icon = 'img/plane.png';
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            var marker;
            if(flight.verb === 'updated') {
                marker = self.markers[flight.id];
                marker.setMap(null);
                console.log("A flight has been updated");
                marker = updateMarker(myLatlng, bus.data.id, icon, "Flight number: " + flight.data.flightNumber.toString(), "flight");
                marker.setMap(self.map);
                return;
            }
            if(flight.verb === 'destroyed') {
                marker = self.markers[flight.id];
                marker.setMap(null);
                console.log("A flight has been deleted");
                return;
            }
            console.log("A flight has been created");
            marker = addMarker(myLatlng, flight.data.id, icon, "Flight number: " + flight.data.flightNumber.toString(), "flight");
            marker.setMap(self.map);
        });
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
                self.userID = res.userID;
                self.clientID = res.clientID;
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
        };
        self.deny = function() {
            $location.url('/profile/' + self.userID);
        };
    }
]).controller('LoginController', ['$http', 'UserService', 'AdminService', '$q',
    function($http, UserService, AdminService, $q) {
        var self = this;
        self.submit = function() {
            var login = $http.post("/api/user/login", {
                username: self.username,
                password: self.password
            }).success(function(res, status, headers) {
                var location = headers().location,
                    friends = [],
                    nonMutual = [],
                    myusername,
                    myid,
                    mytransport,
                    mytransportType;
                var getUser = $http.get(location).success(function(user) {
                    var data = user.collection.items[0].data;
                    var i;
                    for(i = 0; i < data.length; i++) {
                        if(data[i].name === "nickname") {
                            myusername = data[i].value;
                        }
                        if(data[i].name === "id") {
                            myid = data[i].value;
                        }
                    }
                    var links = user.collection.items[0].links;
                    for(i = 0; i < links.length; i++) {
                        if(links[i].rel === "item") {
                            var transport = links[i].href;
                            if(transport.indexOf("bus")) {
                                mytransport = transport.split("/bus/").pop();
                                mytransportType = "bus";
                            }
                            if(transport.indexOf("train")) {
                                mytransport = transport.split("/train/").pop();
                                mytransportType = "train";
                            }
                            if(transport.indexOf("flight")) {
                                mytransport = transport.split("/flight/").pop();
                                mytransportType = "flight";
                            }
                        }
                        if(links[i].rel === "contact") {
                            var getContact = $http.get(links[i].href).success(function(friend) {
                                var data = friend.collection.items[0].data,
                                    username,
                                    id;
                                for(var j = 0; j < data.length; j++) {
                                    if(data[j].name === "nickname") {
                                        username = data[j].value;
                                    }
                                    if(data[j].name === "id") {
                                        id = data[j].value;
                                    }
                                }
                                friend = {};
                                friend[username] = id;
                                friends.push(friend);
                            }).error(function(err) {
                                self.message = "Error downloading friends data.";
                            });
                        }
                        if(links[i].rel === "friend") {
                            var getFriend = $http.get(links[i].href).success(function(friend) {
                                var data = friend.collection.items[0].data,
                                    username,
                                    id;
                                for(var j = 0; j < data.length; j++) {
                                    if(data[j].name === "nickname") {
                                        username = data[j].value;
                                    }
                                    if(data[j].name === "id") {
                                        id = data[j].value;
                                    }
                                }
                                friend = {};
                                friend[username] = id;
                                nonMutual.push(friend);
                                $q.all([login, getUser, getContact, getFriend]).then(function() {
                                    self.message = "Successfully logged in!";
                                    if(self.username === 'admin') {
                                        AdminService.set();
                                    }
                                    UserService.set(myid, myusername, mytransport, mytransportType, friends, nonMutual);
                                });
                            }).error(function(err) {
                                self.message = "Error downloading friends data.";
                            });
                        }
                    }
                }).error(function(err) {
                    self.message = "Error getting your data.";
                });
            }).error(function() {
                self.message = "Incorrect username and/or password.";
            });
        };
    }
]).controller('LogoutController', ['$http', 'UserService', 'AdminService', 'TokenService',
    function($http, UserService, AdminService, TokenService) {
        var self = this;
        $http.get("/api/user/logout").success(function(res) {
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
        };
    }
]).controller('ProfileController', ['$http', '$routeParams', 'UserService', '$location', 'TokenService', 'AdminService',
    function($http, $routeParams, UserService, $location, TokenService, AdminService) {
        var self = this;
        self.UserService = UserService;
        self.AdminService = AdminService;
        self.userID = $routeParams.userID;

        function getUserData() {
            $http.get("/api/user/" + self.userID).success(function(res) {
                self.usersData = res.collection.items[0].data;
                var i;
                for(i = 0; i < self.usersData.length; i++) {
                    if(self.usersData[i].name === "nickname") {
                        self.friendUsername = self.usersData[i].value;
                    }
                }
                //Check if friend can be added
                if(self.UserService.get().userID === self.userID) {
                    self.canAdd = false;
                } else {
                    self.canAdd = true;
                }
                self.alreadyAdded = false;
                if(self.UserService.get().isLoggedIn && self.UserService.get().userID !== self.userID) {
                    var friends = self.UserService.get().friends;
                    var nonMutual = self.UserService.get().nonMutualFriends;
                    if(friends[0]) {
                        for(i = 0; i < friends.length; i++) {
                            for(var friend in friends[i]) {
                                if(friends[i].hasOwnProperty(friend)) {
                                    if(friends[i][friend] === self.userID) {
                                        self.canAdd = false;
                                        self.alreadyAdded = true;
                                    }
                                }
                            }
                        }
                    } else if(nonMutual[0]) {
                        for(i = 0; i < nonMutual.length; i++) {
                            for(var contact in nonMutual[i]) {
                                if(nonMutual[i].hasOwnProperty(contact)) {
                                    if(nonMutual[i][contact] === self.userID) {
                                        self.canAdd = false;
                                        self.alreadyAdded = true;
                                    }
                                }
                            }
                        }
                    }
                }
                self.myFriends = [];
                var links = res.collection.items[0].links;
                if(links[0]) {
                    for(i = 0; i < links.length; i++) {
                        if(links[i].rel === "friend") {
                            $http.get(links[i].href).success(function(friend) {
                                var friendData = friend.collection.items[0].data,
                                    friendName,
                                    friendID;
                                friend = {};
                                for(var j = 0; j < friendData.length; j++) {
                                    if(friendData[j].name === "nickname") {
                                        friendName = friendData[j].value;
                                    }
                                    if(friendData[j].name === "id") {
                                        friendID = friendData[j].value;
                                    }
                                }
                                friend.name = friendName;
                                friend.id = friendID;
                                self.myFriends.push(friend);
                            }).error(function(res) {
                                self.message = "There was a problem downloading this users friend data.";
                            });
                        }
                    }
                }
            }).error(function(res) {
                self.message = "There was a problem downloading this users data.";
            });
        }
        getUserData();
        //Add friend
        self.addFriend = function() {
            $http.put('/api/user/friends/' + self.friendUsername).success(function(res) {
                self.message = "Friend successfully added!";
                var newFriend = {},
                    friends = self.UserService.get().friends,
                    currentUserID = self.UserService.get().userID,
                    currentUsername = self.UserService.get().username,
                    transportID = self.UserService.get().transportID,
                    transportType = self.UserService.get().transportType,
                    nonMutual = self.UserService.get().nonMutualFriends;
                newFriend[self.friendUsername] = self.userID;
                friends.push(newFriend);
                self.UserService.set(currentUserID, currentUsername, transportID, transportType, friends, nonMutual);
                getUserData();
            }).error(function(res) {
                self.message = "There was a problem adding a friend.";
            });
        };
        //Remove friend
        self.deleteFriend = function() {
            $http.delete('/api/user/friends/' + self.friendUsername).success(function(res) {
                self.message = "Friend successfully deleted!";
                var friends = self.UserService.get().friends,
                    currentUserID = self.UserService.get().userID,
                    currentUsername = self.UserService.get().username,
                    transportID = self.UserService.get().transportID,
                    transportType = self.UserService.get().transportType,
                    nonMutual = self.UserService.get().nonMutualFriends,
                    newFriends;
                for(var i = 0; i < friends.length; i++) {
                    if(Object.keys(friends[i]) === self.friendUsername) {
                        newFriends = friends.splice(i, 1);
                    }
                }
                self.UserService.set(currentUserID, currentUsername, transportID, transportType, friends, nonMutual);
                getUserData();
            }).error(function(res) {
                self.message = "There was a problem deleting a friend.";
            });
        };
        self.getAuthCode = function() {
            $location.url('/oauth/authorize/clientID=' + self.clientID + '&redirectURI=' + self.redirectURI);
        };
        self.getAccessToken = function() {
            $location.url('/oauth/token/clientID=' + self.clientID + '&clientSecret=' + self.clientSecret + '&grantType=authorization_code&redirectURI=' + self.redirectURI + '&code=' + self.code);
        };
        self.setAccessToken = function() {
            TokenService.set(self.accessToken, self.refreshToken, self.clientID, self.clientSecret);
        };
    }
]).controller('UserSearchController', ['$http', 'UserService',
    function($http, UserService) {
        var self = this;
        self.UserService = UserService;
        self.submit = function() {
            $http.post('/api/user/search', {
                search: self.search,
                searchBy: self.searchBy
            }).success(function(res) {
                self.results = res.collection.items;
                self.resultIDs = [];
                for(var i = 0; i < self.results.length; i++) {
                    var data = self.results[i].data;
                    for(var j = 0; j < data.length; j++) {
                        if(data[j].name === "id") {
                            var id = data[j].value;
                            self.resultIDs.push(id);
                        }
                    }
                }
            }).error(function(res) {
                self.message = "There was a problem with your search.";
            });
        };
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
        };
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
                                console.log("Error refreshing access token.");
                            });
                        }, 10000);
                    });
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };
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
                    });
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };
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
        });
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
        };
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
        };
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
        };
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
        };
    }
]).controller('AdminClientController', ['AdminService', '$http',
    function(AdminService, $http) {
        var self = this;
        self.AdminService = AdminService;
        self.view = function() {
            $http.get('/api/client/all').success(function(data) {
                self.clients = data.collection.items;
            });
        };
        self.create = function() {
            $http.post('/api/client', {
                name: self.name,
                redirectURI: self.redirectURI
            }).success(function(res) {
                console.log("Successfully created new client!");
            }).error(function(err) {
                console.log("Error");
            });
        };
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
        };
        self.delete = function() {
            $http.delete('/api/client/' + self.clientID).success(function(res) {
                console.log("Client successfully deleted!");
            }).error(function(err) {
                console.log("Error");
            });
        };
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
        };
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
        };
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
        };
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
        };
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
        };
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
        };
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
        };
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
        };
    }
]).controller('AdminUserController', ['AdminService', '$http', 'UserService', 'TokenService',
    function(AdminService, $http, UserService, TokenService) {
        var self = this;
        self.AdminService = AdminService;
        self.view = function() {
            $http.get('/api/user/all').success(function(data) {
                self.users = data.collection.items;
            });
        };
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
        };
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
        };
        self.delete = function() {
            $http.delete('/api/user/' + self.userID).success(function(res) {
                console.log("User successfully deleted!");
                if(self.userID === UserService.get().userID) {
                    UserService.reset();
                    AdminService.reset();
                    TokenService.reset();
                }
            }).error(function(err) {
                console.log("Error");
            });
        };
    }
]);