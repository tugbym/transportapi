/**
 * TrainController
 *
 * @description :: Server-side logic for managing trains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js')('train', ['id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber']);

module.exports = {
    
    //Getting train data.
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //If there is a parameter, search for that. Else, search for all.
        var id = req.params.trainID;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        
        //Search the train model.
        Train.find(query).exec(function(err, docs) {
            
            //No problems.
            if(!err && docs) {
                
                //Subscribe WebSockets to the POST, PUT and DELETE routes.
                Train.watch(req.socket);
                Train.subscribe(req.socket, docs, ['update', 'destroy']);
                
                //Send the response.
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/TrainTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
                
            //No trains found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No train(s) found.", 404));
                
            //Error searching for trains.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Creating trains.
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //Get all the requested data.
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
        
        //Create a new train with it.
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
            
            //No problems.
            if(!err) {
                
                //Update the client so only they can edit the train.
                var doc = [];
                if(req.user.transportsCreated) {
                    var doc = req.user.transportsCreated;
                }
                var newDoc = {
                    ID: train.id,
                    type: 'train'
                };
                doc.push(newDoc);
                Client.update({
                    id: req.user.id
                }, {
                    transportsCreated: doc
                }).exec(function(err, newDoc) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Send the response.
                        res.setHeader("Location", base + "/api/train/" + train.id);
                        res.status(201).json({
                            message: "New Train created: " + train.id
                        });
                        
                        //Update the WebSockets.
                        Train.publishCreate({
                            id: train.id,
                            latitude: train.latitude,
                            longitude: train.longitude,
                            trainNumber: train.trainNumber
                        });
                        
                    //Error updating the client.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Error creating train.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Updating trains.
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.trainID;
        
        // See if the current user can edit this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            
            //ID matches one in the client object.
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        
        //No match.
        if(allowed == false) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "You are not permitted to edit this train.", 403));
        }
        
        var acceptedInputs = ['arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        
        //Create a new document.
        var newDoc = {};
        for(request in req.body) {
            
            //Valid request.
            if(acceptedInputs.indexOf(request) != -1) {
                newDoc[request] = req.body[request]
                
            //Invalid request.
            } else{
                return res.status(400).json(cj.createCjError(base, "Invalid attribute to edit.", 400));
            }
        }
        
        //Update the train model.
        Train.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No problems.
            if(!err && updatedDoc[0]) {
                
                //Send the response.
                res.setHeader("Location", base + "/api/train/" + updatedDoc[0].id);
                res.status(200).json({
                    message: "Train updated: " + updatedDoc[0].id
                });
                
                //Update the WebSockets.
                Train.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude,
                    trainNumber: updatedDoc[0].trainNumber
                });
                
            //No train found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
                
            //Error updating train.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting trains.
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.trainID;
        
        // See if the current user can delete this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            
            //ID matched one in the client object.
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        
        //No match.
        if(allowed == false) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "You are not permitted to delete this train.", 403));
        }
        
        //See if the train ID is valid.
        Train.findOne({
            id: id
        }, function(err, doc) {
            
            //Train ID is valid, proceed with deletion.
            if(!err && doc) {
                Train.destroy({
                    id: id
                }).exec(function(err) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Update the client object, minus the train ID.
                        var newDoc = req.user.transportsCreated;
                        for(var i = 0; i < newDoc.length; i++) {
                            if(newDoc[i].ID == id) {
                                newDoc.splice(i, 1);
                            }
                        }
                        
                        //Update the client model.
                        Client.update({
                            id: req.user.id
                        }, {
                            transportsCreated: newDoc
                        }).exec(function(err, updatedDoc) {
                            
                            //No problems.
                            if(!err) {
                                
                                //Send the response.
                                res.status(200).json({
                                    message: "Train successfully removed."
                                });
                                
                                //Update the WebSockets.
                                Train.publishDestroy(id);
                                
                            //Error updating client.
                            } else {
                                res.setHeader("Content-Type", "application/vnd.collection+json");
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        });
                        
                    //Error deleting train.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
                
            //No train found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
                
            //Error searching for train.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Searching for trains.
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        
        //See if the request is valid, if not, send 400.
        var acceptedSearchByInputs = ['id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber'];
        if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(400).json(cj.createCjError(base, "Search By value not permitted.", 400));
        }
        
        //Create the search query.
        var search = {};
        search[searchBy] = criteria;
        
        //Search the train model.
        Train.find().where(search).limit(20).exec(function(err, results) {
            
            //No problems.
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/TrainTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
                
            //No trains found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
                
            //Error searching for trains.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};