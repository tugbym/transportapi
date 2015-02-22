var map;
var markers = [];

function initialize() {
  io.socket.post('/bus');
  var London = new google.maps.LatLng(51.5000, 0.1167);
  var mapOptions = {
    zoom: 6,
    center: London,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // This event listener will call addMarker() when the map is clicked.
  io.socket.on('bus', function (data) {
        latitude = data.data.latitude
        longitude = data.data.longitude
        var myLatlng = new google.maps.LatLng(latitude,longitude);
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
  for (var i = 0; i < markers.length; i++) {
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

google.maps.event.addDomListener(window, 'load', initialize);

function createNew() {
    io.socket.post('/bus', { arrivalTime: "2015/02/17 05:00", latitude: "51.5000", longitude: "0.1167", departureTime: "2015/02/17 03:00" } );
}