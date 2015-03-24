/**
 * TrainController
 *
 * @description :: Server-side logic for managing trains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var cj = require('../services/CjTemplate.js')('train', ['id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber']);
module.exports = {
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.trainID;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        Train.find(query).exec(function(err, docs) {
            if(!err) {
                Train.watch(req.socket);
                Train.subscribe(req.socket, docs, ['update', 'destroy']);
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/TrainTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
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
        }).exec(function(err, train) {
            if(!err) {
                var doc = [];
                if(req.user.transportsCreated) {
                    var doc = req.user.transportsCreated;
                }
                var newDoc = {
                    ID: train.id,
                    type: 'train'
                };
                doc.push(newDoc);
                Users.update({
                    id: req.user.id
                }, {
                    transportsCreated: doc
                }).exec(function(err, newDoc) {
                    res.status(201).json({
                        message: "New Train created: " + train.trainNumber
                    });
                    Train.publishCreate({
                        id: train.id,
                        latitude: train.latitude,
                        longitude: train.longitude
                    });
                });
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.trainID;
        // See if the current user can edit this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        if(allowed == false) {
            return res.status(403).json(cj.createCjError(base, "You are not permitted to edit this train.", 403));
        }
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Train.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "Train updated: " + updatedDoc[0].trainNumber
                });
                Train.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude
                });
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.trainID;
        // See if the current user can delete this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        if(allowed == false) {
            return res.status(403).json(cj.createCjError(base, "You are not permitted to delete this train.", 403));
        }
        Train.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Train.destroy({
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
                        }, {
                            transportsCreated: newDoc
                        }).exec(function(err, updatedDoc) {
                            res.status(200).json({
                                message: "Train successfully removed."
                            });
                            Train.publishDestroy(id);
                        });
                    } else {
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
            } else {
                res.status(403).json(cj.createCjError(base, err, 403));
            }
        });
    },
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        var acceptedSearchByInputs = ['id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
        }
        var search = {};
        search[searchBy] = criteria;
        Train.find().where(search).limit(20).exec(function(err, results) {
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/TrainTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};