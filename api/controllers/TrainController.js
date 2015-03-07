/**
 * TrainController
 *
 * @description :: Server-side logic for managing trains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js') ('train', ['arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'] );

module.exports = {
    read: function(req, res) {
        var id = req.params.id;
        var query = {};
        if (id) {
            query = {id: id};
        }
        Train.find(query).exec(function(err, docs) {
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
            if(!err && !doc) {
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
                        res.status(500).json({
                            message: "Could not create train. Error: " + err
                        });
                    }
                });
            } else if(!err) {
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
    update: function(req, res) {
        var id = req.params.id;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Train.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err) {
                res.status(200).json({
                    message: "Train updated: " + updatedDoc[0].trainNumber
                });
            } else {
                res.status(500).json({
                    message: "Could not update train: " + err
                });
            }
        });
    },
    delete: function(req, res) {
        var id = req.params.id;
        Train.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Train.destroy(doc).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Train successfully removed."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not delete train: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find train."
                });
            } else {
                res.status(403).json({
                    message: "Could not delete train: " + err
                });
            }
        });
    },
    search: function(req, res) {
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        
        var acceptedSearchByInputs = ['arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        
        if (acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json({message: "Search By value not permitted."});
        }
        
        var search = {};
        search[searchBy] = criteria;
        
        Train.find()
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