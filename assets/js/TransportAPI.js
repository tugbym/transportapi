function initialBusStops(){
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
       if (bStops.verb == 'updated') {
           console.log("Updated " + busStop.id + " with latitude: " + busStop.data.latitude + " and longitude: " + busStop.data.longitude);
       }
        latitude = busStop.data.latitude
        longitude = busStop.data.longitude
        var myLatlng = new google.maps.LatLng(latitude,longitude);
        addMarker(myLatlng);
    });
};