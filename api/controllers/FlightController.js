/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var cj = require('../services/CjTemplate.js')('flight', ['id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude']);
module.exports = {
    
    //Getting flight data.
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //If there was a parameter, search for that. Else, search for all.
        var id = req.params.flightID;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        
        //Query the flight model.
        Flight.find(query).exec(function(err, docs) {
            
            //No problems.
            if(!err && docs) {
                
                //For WebSockets - subscribe them to the POST, PUT and DELETE routes.
                Flight.watch(req.socket);
                Flight.subscribe(req.socket, docs, ['update', 'destroy']);
                
                //Send the response.
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/Flight>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
                
            //No flight found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No flight(s) found.", 404));
                
            //Error searching for flights.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Creating flights.
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //Get all the requests.
        var aircraft = req.body.aircraft;
        var arrivalAirport = req.body.arrivalAirport;
        var arrivalTime = req.body.arrivalTime;
        var departureAirport = req.body.departureAirport;
        var departureTime = req.body.departureTime;
        var flightDistance = req.body.flightDistance;
        var flightNumber = req.body.flightNumber;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        
        //Add them to the flight model.
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
            
            //No problems.
            if(!err) {
                
                //Add the new flight ID to the user so only they can edit it.
                var doc = [];
                if(req.user.transportsCreated) {
                    var doc = req.user.transportsCreated;
                }
                var newDoc = {
                    ID: flight.id,
                    type: 'flight'
                };
                doc.push(newDoc);
                
                //Edit the user.
                Users.update({
                    id: req.user.id
                }, {
                    transportsCreated: doc
                }).exec(function(err, newDoc) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Send the response.
                        res.setHeader("Location", base + "/api/flight/" + flight.id);
                        res.status(201).json({
                            message: "New Flight created: " + flight.id
                        });
                        
                        //For WebSockets - send the new flight data.
                        Flight.publishCreate({
                            id: flight.id,
                            latitude: flight.latitude,
                            longitude: flight.longitude,
                            flightNumber: flight.flightNumber
                        });
                        
                    //Error updating client.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
            
            //Error creating flight.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Updating flights.
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.flightID;
        
        // See if the current user can edit this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            
            //ID matches one on the client object.
            if(req.user.transportsCreated[i].ID == id) {
                allowed = true;
            }
        }
        
        //No match, so no access.
        if(allowed == false) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "You are not permitted to edit this flight.", 403));
        }
        
        var acceptedInputs = ['aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        
        //See if the request is valid.
        var newDoc = {};
        for(request in req.body) {
            
            //Valid request.
            if(acceptedInputs.indexOf(request) != -1) {
                newDoc[request] = req.body[request]
                
            //Invalid request.
            } else {
                return res.status(400).json(cj.createCjError(base, "Invalid attribute to edit.", 400));
            }
        }
        
        //Update the flight model.
        Flight.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No problems.
            if(!err && updatedDoc[0]) {
                
                //Send the response.
                res.setHeader("Location", base + "/api/flight/" + updatedDoc[0].id);
                res.status(200).json({
                    message: "Flight updated: " + updatedDoc[0].id
                });
                
                //Update the WebSockets.
                Flight.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude,
                    flightNumber: updatedDoc[0].flightNumber
                });
                
            //No flight found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
                
            //Error updating flight.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting flights.
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.flightID;
        
        // See if the current user can delete this
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
            return res.status(403).json(cj.createCjError(base, "You are not permitted to delete this flight.", 403));
        }
        
        //See if the flight ID is valid.
        Flight.findOne({
            id: id
        }, function(err, doc) {
            
            //Valid ID, so proceed with deletion.
            if(!err && doc) {
                Flight.destroy({
                    id: id
                }).exec(function(err) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Update the user object.
                        var newDoc = req.user.transportsCreated;
                        for(var i = 0; i < newDoc.length; i++) {
                            if(newDoc[i].ID == id) {
                                newDoc.splice(i, 1);
                            }
                        }
                        
                        //Update the user model.
                        Users.update({
                            id: req.user.id
                        }, {
                            transportsCreated: newDoc
                        }).exec(function(err, updatedDoc) {
                            
                            //No problems.
                            if(!err) {
                                
                                //Send the response.
                                res.status(200).json({
                                    message: "Flight successfully removed."
                                });
                                
                                //Update the WebSockets.
                                Flight.publishDestroy(id);
                                
                            //Error updating the client.
                            } else {
                                res.setHeader("Content-Type", "application/vnd.collection+json");
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        });
                        
                    //Error deleting the flight.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
                
            //No flight found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
                
            //Error searching for flight.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Searching for Flights
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        
        //See if the request is valid - if not, send a 400.
        var acceptedSearchByInputs = ['id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude'];
        if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(400).json(cj.createCjError(base, "Search By value not permitted.", 400));
        }
        
        //Create the search query.
        var search = {};
        search[searchBy] = criteria;
        
        //Search the Flight model.
        Flight.find().where(search).limit(20).exec(function(err, results) {
            
            //Results found.
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/Flight>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
                
            //No results found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
                
            //Error searching for flights.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};