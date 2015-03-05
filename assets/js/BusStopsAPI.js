function initialize(){
// Parsing json - nearby bus 
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            response = JSON.parse(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET","http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100",true);
    xmlhttp.send();
    
    //Event listener - ends a post request to a url specified
    io.socket.post('/busStop', function (busStop){
       if (busStop.verb == 'updated') {
           console.log("Updated " + busStop.id + " with latitude: " + busStop.data.latitude + " and longitude: " + busStop.data.longitude);
       }
        latitude = busStop.data.latitude
        longitude = busStop.data.longitude
        var myLatlng = new google.maps.LatLng(latitude,longitude);
        addMarker(myLatlng);
    });
};

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


// Send a PUT request to the busStop route through Socket.io:
function createNew() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            io.socket.post('/busStop', { latitude: position.coords.latitude, longitude: position.coords.longitude } );
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function update() {
    latitude = document.forms["latLonForm"]["latitude"].value;
    longitude = document.forms["latLonForm"]["longitude"].value;
    io.socket.put('/busStop', { latitude: latitude, longitude: longitude } );
}

//start map
google.maps.event.addDomListener(window, 'load', initialize);