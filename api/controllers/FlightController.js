/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  read: function (req, res) {
    Flight.find().exec(function(err, docs) {
        if(!err) {
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, docs));
        } else {
            res.status(500).json({message: err});
        }
    });
  },
  create: function (req, res) {
    Flight.watch(req);
    console.log("New subscribed user: " + sails.sockets.id(req));
    var aircraft = req.body.aircraft;
    var arrivalAirport = req.body.arrivalAirport;
    var arrivalTime = req.body.arrivalTime;
    var departureAirport = req.body.departureAirport;
    var departureTime = req.body.departureTime;
    var flightDistance = req.body.flightDistance;
    var flightNumber = req.body.flightNumber;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    
    Flight.findOne({
        name: {
            $regex: new RegExp(flightNumber, "i")
        }
    }, function(err, doc) {
        if (!err && !doc) {
            Flight.create({
                aircraft: aircraft,
                arrivalAirport: arrivalAirport,
                arrivalTime: new Date(arrivalTime),
                departureAirport: departureAirport,
                departureTime: new Date(departureTime),
                flightDistance: flightDistance,
                flightNumber: flightNumber,
                latitude: latitude, 
                longitude: longitude
            })
                .exec(function(err, flight) {
                if (!err) {
                    res.status(201).json({
                        message: "New Flight created: " + flight.flightNumber
                    });
                    
                    Flight.publishCreate({id: flight.id, latitude: flight.latitude, longitude: flight.longitude});
                    
                } else {
                    res.status(500).json({
                        message: "Could not create flight. Error: " + err
                    });
                }
            });
        } else if (!err) {
            res.status(403).json({
                message: "Flight with that name already exists, please use PUT instead, or use another name."
            });
        } else {
            res.status(500).json({
                message: "Could not create flight. Error: " + err
            });
        }
    });
  },
  update: function (req, res) {
      var id = req.params.id;
      var newDoc = {};
      for (request in req.body) {
          newDoc[request] = req.body[request]
      }
      Flight.update({id: id}, newDoc)
      .exec(function(err, updatedDoc) {
          if (!err) {
              res.status(200).json({message: "Flight updated: " + updatedDoc[0].flightNumber});
          } else {
              res.status(500).json({message: "Could not update flight: " + err});
          }
      });
  },
  delete: function (req, res) {
    var id = req.params.id;
      
    Flight.findOne({id: id}, function(err, doc) {
        if (!err && doc) {
            Flight.destroy(doc)
            .exec(function(err) {
                if (!err) {
                    res.status(200).json({message: "Flight successfully removed."});
                } else {
                    res.status(403).json({message: "Could not delete flight: " + err});
                }
            })
        } else if (!err) {
            res.status(404).json({message: "Could not find flight."});
        } else {
            res.status(403).json({message: "Could not delete flight: " + err});
        }
    });
  }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/flight';

    cj.collection.links = [];
    cj.collection.links.push({'rel':'home', 'href' : base});

    cj.collection.items = [];
    
    if (docs.length) {
        renderTransports(cj, base, docs);
    } else {
        renderTransport(cj, base, docs);
    }
    
    cj.collection.items.links = [];
    
    cj.collection.queries = [];
    cj.collection.template = {};
    return cj;
}

function renderTransports(cj, base, docs) {

    for(var i=0;i<docs.length;i++) {
        item = {};
        item.href = base + '/flight/' + docs[i]._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        
        for (var d in docs[i]) {
            if (values.indexOf(d) != -1) {
                item.data[p++] = {
                    'name': d, 
                    'value': docs[i][d], 
                    'prompt': d
                };
            }
        }
        
        cj.collection.items.push(item);
    }
}

function renderTransport(cj, base, docs) {

        item = {};
        item.href = base + '/flight/' + docs._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        
        for (var d in docs) {
            if (values.indexOf(d) != -1) {
                item.data[p++] = {
                    'name': d, 
                    'value': docs[d], 
                    'prompt': d
                };
            }
        }
        
        cj.collection.items.push(item);
}