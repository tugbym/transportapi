/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js') ('flight', ['aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'] );

module.exports = {
    read: function(req, res) {
        Flight.find().exec(function(err, docs) {
            if(!err) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, docs));
            } else {
                res.status(500).json({
                    message: err
                });
            }
        });
    },
    create: function(req, res) {
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
            if(!err && !doc) {
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
                }).exec(function(err, flight) {
                    if(!err) {
                        res.status(201).json({
                            message: "New Flight created: " + flight.flightNumber
                        });
                        Flight.publishCreate({
                            id: flight.id,
                            latitude: flight.latitude,
                            longitude: flight.longitude
                        });
                    } else {
                        res.status(500).json({
                            message: "Could not create flight. Error: " + err
                        });
                    }
                });
            } else if(!err) {
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
    update: function(req, res) {
        var id = req.params.id;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Flight.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err) {
                res.status(200).json({
                    message: "Flight updated: " + updatedDoc[0].flightNumber
                });
            } else {
                res.status(500).json({
                    message: "Could not update flight: " + err
                });
            }
        });
    },
    delete: function(req, res) {
        var id = req.params.id;
        Flight.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Flight.destroy(doc).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Flight successfully removed."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not delete flight: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find flight."
                });
            } else {
                res.status(403).json({
                    message: "Could not delete flight: " + err
                });
            }
        });
    },
    search: function(req, res) {
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        
        var acceptedSearchByInputs = ['aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        
        if (acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json({message: "Search By value not permitted."});
        }
        
        var search = {};
        search[searchBy] = criteria;
        
        Flight.find()
        .where(search)
        .limit(20)
        .exec(function(err, results) {
            if (!err && results[0]) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if (!err) {
                res.status(404).json({message: "No results found."});
            } else {
                res.status(500).json({message: "Error processing query: " + err});
            }
        })
    }
};