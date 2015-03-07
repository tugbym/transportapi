var map;
var markers = [];
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

function initialize() {
    // Set up the default map:
    // var London = new gooogle.maps.LatLng(51.500926, -0.123961);
    // var BirminghamUK = new google.maps.LatLng(52.477309, -1.896418);
    var Coventry = new google.maps.LatLng(52.406826, -1.504156);
    var mapOptions = {
        zoom: 14,
        center: Coventry,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // Subscribe to the bus route, and get currently stored data:
    io.socket.get('/bus', function(data) {
        var buses = data.collection.items;
        for(var i = 0; i < buses.length; i++) {
            data = buses[i].data;
            var latitude = data[6].value;
            var longitude = data[7].value;
            var myLatlng = new google.maps.LatLng(latitude, longitude);
            addMarker(myLatlng);
        }
    });
    // Someone just posted to the bus route, grab that data, and create a new marker.
    io.socket.on('bus', function(bus) {
        if(bus.verb == 'updated') {
            console.log("Updated " + bus.id + " with latitude: " + bus.data.latitude + " and longitude: " + bus.data.longitude);
        }
        latitude = bus.data.latitude
        longitude = bus.data.longitude
        var myLatlng = new google.maps.LatLng(latitude, longitude);
        addMarker(myLatlng);
    });
}
// Add a marker to the map and push to the array.

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    showMarkers();
}
// Sets the map on all markers in the array.

function setAllMap(map) {
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
// Removes the markers from the map, but keeps them in the array.

function clearMarkers() {
    setAllMap(null);
}
// Shows any markers currently in the array.

function showMarkers() {
    setAllMap(map);
}
// Deletes all markers in the array by removing references to them.

function deleteMarkers() {
    clearMarkers();
    markers = [];
}
// Send a PUT request to the bus route through Socket.io:

function createNew() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            io.socket.post('/bus', {
                arrivalTime: "2015/02/17 10:00",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                departureTime: "2015/02/17 03:00"
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function update() {
    latitude = document.forms["latLonForm"]["latitude"].value;
    longitude = document.forms["latLonForm"]["longitude"].value;
    io.socket.put('/bus/54e248938ac5055f0a27d126', {
        arrivalTime: "2015/02/17 10:00",
        latitude: latitude,
        longitude: longitude,
        departureTime: "2015/02/17 03:00"
    });
}
// Start up the map.
google.maps.event.addDomListener(window, 'load', initialize);