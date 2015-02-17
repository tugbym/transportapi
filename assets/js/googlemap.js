function initialize() {
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
          center: new google.maps.LatLng(51.5000, 0.1167), //longitude and latitude for uk
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions)
      }
      google.maps.event.addDomListener(window, 'load', initialize);

        io.socket.post('/bus');
        
        io.socket.on('bus', function (data) {
            var display = document.getElementById('displaypanel');
            display.innerHTML = display.innerHTML + "<br>" + "Latitude" + ": " + data.data.latitude + "<br>" + "Longitude" + ": " + data.data.longitude
        });

function createNew() {
    io.socket.post('/bus', { arrivalTime: "2015/02/17 05:00", latitude: "23.56", longitude: "56.45" } );
}