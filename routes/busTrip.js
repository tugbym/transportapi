var express = require('express');
var router = express.Router();
var BusTrip = require('../models/bustrip').BusTrip;

router.get('/', function(req, res, next) {
    BusTrip.find({}, function(err, docs) {
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
    BusTrip.findById(id, function(err, doc) {
        if(!err && doc) {
            var base = 'http://' + req.headers.host;
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(200).json(createCjTemplate(base, doc));
        } else if (err) {
            res.status(500).json({message: "Error getting bus: " + err});
        } else {
            res.status(404).json({message: "Bus not found."});
        }
    });
});

router.post('/', function(req, res) {
    var arrivalBusStop = req.body.arrivalBusStop;
    var arrivalTime = req.body.arrivalTime;
    var busName = req.body.busName;
    var busNumber = req.body.busNumber;
    var departureBusStop = req.body.departureBusStop;
    var departureTime = req.body.departureTime;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    
    BusTrip.findOne({
        name: {
            $regex: new RegExp(busNumber, "i")
        }
    }, function(err, doc) {
        if (!err && !doc) {
            var newBusTrip = new BusTrip();
            
            newBusTrip.arrivalBusStop = arrivalBusStop;
            newBusTrip.arrivalTime = arrivalTime;
            newBusTrip.busName = busName;
            newBusTrip.busNumber = busNumber;
            newBusTrip.departureBusStop = departureBusStop;
            newBusTrip.departureTime = departureTime;
            newBusTrip.geo.latitude = latitude;
            newBusTrip.geo.longitude = longitude;
            
            newBusTrip.save(function(err) {
                
                if (!err) {
                    res.status(201).json({
                        message: "New Bus created: " + newBusTrip.busNumber
                    });
                } else {
                    res.status(500).json({
                        message: "Could not create bus. Error: " + err
                    });
                }
            });
        } else if (!err) {
            res.status(403).json({
                message: "Bus with that name already exists, please use PUT instead, or use another name."
            });
        } else {
            res.status(500).json({
                message: "Could not create bus. Error: " + err
            });
        }
    });
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    
    BusTrip.findById(id, function(err, doc) {
        if(!err && doc) {
            
            for (request in req.body) {
                doc[request] = req.body[request];
            }
            
            doc.save(function(err) {
                if (!err) {
                    res.status(200).json({message: "Bus updated: " + doc.busNumber});
                } else {
                    res.status(500).json({message: "Could not update bus: " + err});
                }
            });
        } else if (!err) {
            res.status(404).json({message: "Could not find bus."});
        } else {
            res.status(500).json({message: "Could not update bus: " + err});
        }
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    BusTrip.findById(id, function(err, doc) {
        if (!err && doc) {
            doc.remove();
            res.status(200).json({message: "Bus successfully removed."});
        } else if (!err) {
            res.status(404).json({message: "Could not find bus."});
        } else {
            res.status(403).json({message: "Could not delete bus: " + err});
        }
    });
});

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/bus';

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
        item.href = base + '/bus/' + docs[i]._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'geo'];
        
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
        item.href = base + '/bus/' + docs._id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['_id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'geo'];
        
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