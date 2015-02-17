/**
 * TrainController
 *
 * @description :: Server-side logic for managing trains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  read: function (req, res) {
    Train.find().exec(function(err, docs) {
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
    Train.watch(req);
    console.log("New subscribed user: " + sails.sockets.id(req));
    var arrivalPlatform = req.body.arrivalPlatform;
    var arrivalStation = req.body.arrivalStation;
    var arrivalTime = req.body.arrivalTime;
    var departurePlatform = req.body.departurePlatform;
    var departureStation = req.body.departureStation;
    var departureTime = req.body.departureTime;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var trainName = req.body.trainName;
    var trainNumber = req.body.trainNumber;
    
    Train.findOne({
        name: {
            $regex: new RegExp(flightNumber, "i")
        }
    }, function(err, doc) {
        if (!err && !doc) {
            Train.create({
                arrivalPlatform: arrivalPlatform,
                arrivalStation: arrivalStation,
                arrivalTime: new Date(arrivalTime),
                departurePlatform: departurePlatform,
                departureStation: departureStation,
                departureTime: new Date(departureTime),
                latitude: latitude, 
                longitude: longitude,
                trainName: trainName,
                trainNumber: trainNumber
            })
                .exec(function(err, train) {
                if (!err) {
                    res.status(201).json({
                        message: "New Train created: " + train.trainNumber
                    });
                    
                    Train.publishCreate({id: train.id, latitude: train.latitude, longitude: train.longitude});
                    
                } else {
                    res.status(500).json({
                        message: "Could not create train. Error: " + err
                    });
                }
            });
        } else if (!err) {
            res.status(403).json({
                message: "Train with that name already exists, please use PUT instead, or use another name."
            });
        } else {
            res.status(500).json({
                message: "Could not create train. Error: " + err
            });
        }
    });
  },
  update: function (req, res) {
    var id = req.params.id;
    
    Train.findOne({ id: id }, function(err, doc) {
        if(!err && doc) {
            
            var updatedDoc;
            for (request in req.body) {
                updatedDoc = {
                    request: req.body[request]
                }
            }
            Train.update(updatedDoc)
            .exec(function(err, train) {
                if (!err) {
                    res.status(200).json({message: "Train updated: " + train.trainNumber});
                } else {
                    res.status(500).json({message: "Could not update train: " + err});
                }
            });
        } else if (!err) {
            res.status(404).json({message: "Could not find train."});
        } else {
            res.status(500).json({message: "Could not update train: " + err});
        }
    });
  },
  delete: function (req, res) {
    var id = req.params.id;
    Flight.findOne({ id: id }, function(err, doc) {
        if (!err && doc) {
            Bus.destroy(doc)
            .exec(function(err) {
                if (!err) {
                    res.status(200).json({message: "Train successfully removed."});
                } else {
                    res.status(500).json({message: "Could not delete train: " + err});
                }
            });
        } else if (!err) {
            res.status(404).json({message: "Could not find train."});
        } else {
            res.status(403).json({message: "Could not delete train: " + err});
        }
    });
  }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/train';

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
        item.href = base + '/train/' + docs[i]._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        
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
        item.href = base + '/train/' + docs._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        
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