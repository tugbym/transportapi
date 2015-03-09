/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var cj = require('../services/CjTemplate.js')('flight', ['id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude']);
module.exports = {
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var id = req.params.id;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        Flight.find(query).exec(function(err, docs) {
            if(!err) {
                Flight.watch(req.socket);
                Flight.subscribe(req.socket, docs, ['update', 'destroy']);
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/Flight>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var aircraft = req.body.aircraft;
        var arrivalAirport = req.body.arrivalAirport;
        var arrivalTime = req.body.arrivalTime;
        var departureAirport = req.body.departureAirport;
        var departureTime = req.body.departureTime;
        var flightDistance = req.body.flightDistance;
        var flightNumber = req.body.flightNumber;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
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
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var id = req.params.id;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Flight.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "Flight updated: " + updatedDoc[0].flightNumber
                });
            } else if (!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var id = req.params.id;
        Flight.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Flight.destroy({id: id}).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Flight successfully removed."
                        });
                    } else {
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
            } else {
                res.status(403).json(cj.createCjError(base, err, 403));
            }
        });
    },
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        var acceptedSearchByInputs = ['aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
        }
        var search = {};
        search[searchBy] = criteria;
        Flight.find().where(search).limit(20).exec(function(err, results) {
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/Flight>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};