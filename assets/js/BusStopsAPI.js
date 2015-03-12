var map;
var markers = [];

function initialize(){
    
    var json = [
        {
            "title" : "Coventry University",
            "lat" : 52.40687,
            "lng" : -1.50032,
            "description" : "Bus Stop at Coventry University",
        },
        {
            "title" : "Coventry University",
            "lat" : 52.40792,
            "lng" : -1.50383,
            "description" : "Bus Stop at Cox St Coventry",
            
        } ];
    
    var myLatlng = new google.maps.LatLng(52.40687, -1.50032);
    var mapOption = {
        zoom : 15,
        center : myLatlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    for (var i = 0, length = json.length; i < length; i++){
        var data = json[i], latLng = new google.maps.LatLng(data.lat, data.lng);
        
        //create marker and put it on the map
        var marker = new google.maps.Marker({
            position : latLng,
            map : map,
            title : data.title
        });
        marker.setMap(map);
    }
}

// Parsing json - nearby bus stop
function BusStopsParse(){
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
    xmlhttp.open("GET","http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.406754&lon=-1.504129",true);
    xmlhttp.send();
    
    //Event listener - ends a post request to a url specified
    io.socket.post('/busStop', function (busStop){
       if (busStop.verb == 'updated') {
           console.log("Updated " + busStop.id + " with latitude: " + busStop.data.latitude + " and longitude: " + busStop.data.longitude);
       }
        var latitude = busStop.data.latitude
        var longitude = busStop.data.longitude
        var myLatlng = new google.maps.LatLng(latitude,longitude);
        addMarker(myLatlng);
    });
}

// Send a PUT request to the bus stop route through Socket.io:
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
    io.socket.put('/busStop/54e248938ac5055f0a27d126', { latitude: latitude, longitude: longitude } );
}

//start map
google.maps.event.addDomListener(window, 'load', initialize);