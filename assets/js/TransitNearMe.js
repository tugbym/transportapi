// var getJSON = function(url) {
//   return new Promise(function(resolve, reject) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('get', url, true);
//     xhr.responseType = 'json';
//     xhr.onload = function() {
//       var status = xhr.status;
//       if (status == 200) {
//         resolve(xhr.response);
//       } else {
//         reject(status);
//       }
//     };
//     xhr.send();
//   });
// };

// getJSON('http://transportapi.com/v3/uk/bus/stops/near.json?api_key=184a827b941061e6ba980b9d2bcd7121&app_id=4707c100&geolocate=false&lat=52.4353725&lon=-1.9664651000000002').then(function(data) {
//     //alert('Your Json result is:  ' + data.minlat); // for debug
    
//     document.getElementById("NearMe").addEventListener("click", function(){
//         document.getElementById("displaypanel").innerHTML = data.minlat;
//     });
//     //displaypanel.innerText = data.result; //display the result in an HTML element
// }, function(status) { //error detection....
//   alert('Something went wrong.');
// });