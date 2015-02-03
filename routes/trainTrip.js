var express = require('express');
var router = express.Router();
var TrainTrip = require('../models/traintrip').TrainTrip;

router.get('/', function(req, res, next) {
    TrainTrip.find({}, function(err, docs) {
        if(!err) {
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, docs));
        } else {
            res.status(500).json({message: err});
        }
    });
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    TrainTrip.findById(id, function(err, doc) {
        if(!err && doc) {
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, doc));
        } else if (err) {
            res.status(500).json({message: "Error getting train: " + err});
        } else {
            res.status(404).json({message: "Train not found."});
        }
    });
});

router.post('/', function(req, res) {
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
    
    TrainTrip.findOne({
        name: {
            $regex: new RegExp(trainNumber, "i")
        }
    }, function(err, doc) {
        if (!err && !doc) {
            var newTrainTrip = new TrainTrip();
            
            newTrainTrip.arrivalPlatform = arrivalPlatform;
            newTrainTrip.arrivalStation = arrivalStation;
            newTrainTrip.arrivalTime = arrivalTime;
            newTrainTrip.departurePlatform = departurePlatform;
            newTrainTrip.departureStation = departureStation;
            newTrainTrip.departureTime = departureTime;
            newTrainTrip.geo.latitude = latitude;
            newTrainTrip.geo.longitude = longitude;
            newTrainTrip.trainName = trainName;
            newTrainTrip.trainNumber = trainNumber;
            
            newTrainTrip.save(function(err) {
                
                if (!err) {
                    res.status(201).json({
                        message: "New Train created: " + newTrainTrip.trainNumber
                    });
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
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    
    TrainTrip.findById(id, function(err, doc) {
        if(!err && doc) {
            
            for (request in req.body) {
                doc[request] = req.body[request];
            }
            
            doc.save(function(err) {
                if (!err) {
                    res.status(200).json({message: "Train updated: " + doc.trainNumber});
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
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    TrainTrip.findById(id, function(err, doc) {
        if (!err && doc) {
            doc.remove();
            res.status(200).json({message: "Train successfully removed."});
        } else if (!err) {
            res.status(404).json({message: "Could not find train."});
        } else {
            res.status(403).json({message: "Could not delete train: " + err});
        }
    });
});

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/train';

    cj.collection.links = [];
    cj.collection.links.push({'rel':'home', 'href' : base});

    cj.collection.items = [];
    
    if (docs.length) {
        renderFlights(cj, base, docs);
    } else {
        renderFlight(cj, base, docs);
    }
    
    cj.collection.items.links = [];
    
    cj.collection.queries = [];
    cj.collection.template = {};
    return cj;
}

function renderFlights(cj, base, docs) {

    for(var i=0;i<docs.length;i++) {
        item = {};
        item.href = base + '/train/' + docs[i]._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'geo', 'trainName', 'trainNumber'];
        
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

function renderFlight(cj, base, docs) {

        item = {};
        item.href = base + '/train/' + docs._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'geo', 'trainName', 'trainNumber'];
        
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

module.exports = router;