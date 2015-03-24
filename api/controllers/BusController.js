/**
 * BusController
 *
 * @description :: Server-side logic for managing buses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var cj = require('../services/CjTemplate.js')('bus', ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude']);
module.exports = {
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.busID;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        Bus.find(query).exec(function(err, docs) {
            if(!err && docs) {
                Bus.watch(req.socket);
                Bus.subscribe(req.socket, docs, ['update', 'destroy']);
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/BusTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No buses found.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
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
                var doc = [];
                if(req.user.transportsCreated) {
                    var doc = req.user.transportsCreated;
                }
                var newDoc = {
                    ID: bus.id,
                    type: 'bus'
                };
                doc.push(newDoc);
                Users.update({
                    id: req.user.id
                }, {
                    transportsCreated: doc
                }).exec(function(err, newDoc) {
                    res.status(201).json({
                        message: "New Bus created.",
                        busID: bus.id
                    });
                    Bus.publishCreate({
                        id: bus.id,
                        latitude: bus.latitude,
                        longitude: bus.longitude
                    });
                });
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.busID;
        // See if the current user can edit this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        if(allowed == false) {
            return res.status(403).json(cj.createCjError(base, "You are not permitted to edit this bus.", 403));
        }
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Bus.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "Bus updated.",
                    busID: updatedDoc[0].id
                });
                Bus.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude
                });
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.busID;
        // See if the current user can delete this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        if(allowed == false) {
            return res.status(403).json(cj.createCjError(base, "You are not permitted to delete this bus.", 403));
        }
        Bus.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Bus.destroy({
                    id: id
                }).exec(function(err) {
                    if(!err) {
                        var newDoc = req.user.transportsCreated;
                        for(var i = 0; i < newDoc.length; i++) {
                            if(newDoc[i].ID == id) {
                                newDoc.splice(i, 1);
                            }
                        }
                        Users.update({
                            id: req.user.id
                        }, {transportsCreated: newDoc}).exec(function(err, updatedDoc) {
                            res.status(200).json({
                                message: "Bus successfully removed."
                            });
                            Bus.publishDestroy(id);
                        });
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        var acceptedSearchByInputs = ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
        }
        var search = {};
        search[searchBy] = criteria;
        Bus.find().where(search).limit(20).exec(function(err, results) {
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/BusTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No search results found.", 404));
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};