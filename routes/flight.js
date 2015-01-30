var express = require('express');
var router = express.Router();
var Flight = require('../models/flight').Flight;

router.get('/', function(req, res, next) {
    Flight.find({}, function(err, docs) {
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
    Flight.findById(id, function(err, doc) {
        if(!err && doc) {
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, doc));
        } else if (err) {
            res.status(500).json({message: "Error getting flight: " + err});
        } else {
            res.status(404).json({message: "Flight not found."});
        }
    });
});

router.post('/', function(req, res) {
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
            var newFlight = new Flight();
            
            newFlight.aircraft = aircraft;
            newFlight.arrivalAirport = arrivalAirport;
            newFlight.arrivalTime = new Date(arrivalTime);
            newFlight.departureAirport = departureAirport;
            newFlight.departureTime = new Date(departureTime);
            newFlight.flightDistance = flightDistance;
            newFlight.flightNumber = flightNumber;
            newFlight.geo.latitude = latitude;
            newFlight.geo.longitude = longitude;
            
            newFlight.save(function(err) {
                
                if (!err) {
                    res.status(201).json({
                        message: "New Flight created: " + newFlight.flightNumber
                    });
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
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    
    Flight.findById(id, function(err, doc) {
        if(!err && doc) {
            
            for (request in req.body) {
                doc[request] = req.body[request];
            }
            
            doc.save(function(err) {
                if (!err) {
                    res.status(200).json({message: "Flight updated: " + doc.flightNumber});
                } else {
                    res.status(500).json({message: "Could not update flight: " + err});
                }
            });
        } else if (!err) {
            res.status(404).json({message: "Could not find flight."});
        } else {
            res.status(500).json({message: "Could not update flight: " + err});
        }
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    Flight.findById(id, function(err, doc) {
        if (!err && doc) {
            doc.remove();
            res.status(200).json({message: "Flight successfully removed."});
        } else if (!err) {
            res.status(404).json({message: "Could not find flight."});
        } else {
            res.status(403).json({message: "Could not delete flight: " + err});
        }
    });
});

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/flight';

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
        item.href = base + '/flight/' + docs[i]._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'geo'];
        
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
        item.href = base + '/flight/' + docs._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'geo'];
        
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