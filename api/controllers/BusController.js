/**
 * BusController
 *
 * @description :: Server-side logic for managing buses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js') ('bus', ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'] );

module.exports = {
    read: function(req, res) {
        var id = req.params.id;
        var query = {};
        if (id) {
            query = {id: id};
        }
        Bus.find(query).exec(function(err, docs) {
            var base = 'http://' + req.headers.host;
            if(!err) {
                Bus.subscribe(req.socket, docs, ['create', 'update', 'delete']);
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, docs));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    create: function(req, res) {
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
        }).exec(function(err, bus) {
            if(!err) {
                res.status(201).json({
                    message: "New Bus created: " + bus.busNumber
                });
                Bus.publishCreate({
                    id: bus.id,
                    latitude: bus.latitude,
                    longitude: bus.longitude
                });
            } else {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    update: function(req, res) {
        var id = req.params.id;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Bus.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "Bus updated: " + updatedDoc[0].busNumber
                });
                Bus.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude
                });
            } else if (!err) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Bus not found.", 404));
            } else {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var id = req.params.id;
        Bus.findOne({
            id: id
        }, function(err, doc) {
            var base = 'http://' + req.headers.host;
            if(!err && doc) {
                Bus.destroy(doc).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Bus successfully removed."
                        });
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(403).json(cj.createCjError(base, err, 403));
            }
        });
    },
    search: function(req, res) {
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        var base = 'http://' + req.headers.host;
        
        var acceptedSearchByInputs = ['arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        
        if (acceptedSearchByInputs.indexOf(searchBy) == -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
        }
        
        var search = {};
        search[searchBy] = criteria;
        
        Bus.find()
        .where(search)
        .limit(20)
        .exec(function(err, results) {
            if (!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if (!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No search results found.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};