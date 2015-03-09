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
        
        var id = req.params.id;
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
                res.status(201).json({
                    message: "New Train created: " + train.trainNumber
                });
                Train.publishCreate({
                    id: train.id,
                    latitude: train.latitude,
                    longitude: train.longitude
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
        Train.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "Train updated: " + updatedDoc[0].trainNumber
                });
            } else if (!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var id = req.params.id;
        Train.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Train.destroy({id: id}).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Train successfully removed."
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
        
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        var acceptedSearchByInputs = ['arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
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