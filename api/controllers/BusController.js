/**
 * BusController
 *
 * @description :: Server-side logic for managing buses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  read: function (req, res) {
    Bus.find().exec(function(err, docs) {
        if(!err) {
            Bus.subscribe(req.socket, docs);
            Bus.watch(req);
            console.log("New subscribed user: " + sails.sockets.id(req));
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, docs));
        } else {
            res.status(500).json({message: err});
        }
    });
  },
  create: function (req, res) {
    var arrivalBusStop = req.body.arrivalBusStop;
    var arrivalTime = req.body.arrivalTime;
    var busName = req.body.busName;
    var busNumber = req.body.busNumber;
    var departureBusStop = req.body.departureBusStop;
    var departureTime = req.body.departureTime;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
      
            Bus.create({
                arrivalBusStop: arrivalBusStop,
                arrivalTime: new Date(arrivalTime),
                busName: busName,
                busNumber: busNumber,
                departureBusStop: departureBusStop,
                departureTime: new Date(departureTime),
                latitude: latitude, 
                longitude: longitude
            })
                .exec(function(err, bus) {
                if (!err) {
                    res.status(201).json({
                        message: "New Bus created: " + bus.busNumber
                    });
                    
                    Bus.publishCreate({id: bus.id, latitude: bus.latitude, longitude: bus.longitude});
                    
                } else {
                    res.status(500).json({
                        message: "Could not create bus. Error: " + err
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
      Bus.update({id: id}, newDoc)
      .exec(function(err, updatedDoc) {
          if (!err) {
              res.status(200).json({message: "Bus updated: " + updatedDoc[0].busNumber});
              Bus.publishUpdate(updatedDoc[0].id, {latitude: updatedDoc[0].latitude, longitude: updatedDoc[0].longitude});
          } else {
              res.status(500).json({message: "Could not update bus: " + err});
          }
      });
  },
  delete: function (req, res) {
    var id = req.params.id;
      
    Bus.findOne({id: id}, function(err, doc) {
        if (!err && doc) {
            Bus.destroy(doc)
            .exec(function(err) {
                if (!err) {
                    res.status(200).json({message: "Bus successfully removed."});
                } else {
                    res.status(403).json({message: "Could not delete bus: " + err});
                }
            })
        } else if (!err) {
            res.status(404).json({message: "Could not find bus."});
        } else {
            res.status(403).json({message: "Could not delete bus: " + err});
        }
    });
  }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/bus';

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
        item.href = base + '/bus/' + docs[i].id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        
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
        item.href = base + '/bus/' + docs.id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        
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