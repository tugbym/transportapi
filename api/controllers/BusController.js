/**
 * BusController
 *
 * @description :: Server-side logic for managing buses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js')('bus', ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude']);

module.exports = {
    
    //Displaying buses.
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //If there was a parameter set, search for that. Else, search for all users.
        var id = req.params.busID;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        
        //Query the Bus model
        Bus.find(query).exec(function(err, docs) {
            
            //No errors returned, and we got document(s) back. No problems.
            if(!err && docs) {
                
                //If the user sent a request with a WebSocket - subscribe them to the POST, PUT and DELETE routes.
                Bus.watch(req.socket);
                Bus.subscribe(req.socket, docs, ['update', 'destroy']);
                
                //Send the document(s) back in the collection+json format.
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/BusTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, docs));
                
            //No errors returned, but no documents.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No bus found.", 404));
                
            //Error returned.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Creating buses.
    create: function(req, res) {
        
        //Grab all data sent in the request.
        var base = 'http://' + req.headers.host;
        var arrivalBusStop = req.body.arrivalBusStop;
        var arrivalTime = req.body.arrivalTime;
        var busName = req.body.busName;
        var busNumber = req.body.busNumber;
        var departureBusStop = req.body.departureBusStop;
        var departureTime = req.body.departureTime;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        
        if(!arrivalTime) {
            arrivalTime = "01/01/01 01:01";
        }
        if(!departureTime) {
            departureTime = "01/01/01 01:01";
        }
        
        //Add it to the Bus model.
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
            
            //No problems with the creation.
            if(!err) {
                
                //Add the new bus to the user - so only they can access it.
                var doc = [];
                if(req.user.transportsCreated) {
                    doc = req.user.transportsCreated;
                }
                var newDoc = {
                    ID: bus.id,
                    type: 'bus'
                };
                doc.push(newDoc);
                
                //Update their user model
                Users.update({
                    id: req.user.id
                }, {
                    transportsCreated: doc
                }).exec(function(err, newDoc) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Send the response.
                        res.setHeader("Location", base + "/api/bus/" + bus.id);
                        res.status(201).json({
                            message: "New Bus created.",
                            busID: bus.id
                        });
                        
                        //For subscribed sockets - send the new bus data.
                        Bus.publishCreate({
                            id: bus.id,
                            latitude: bus.latitude,
                            longitude: bus.longitude,
                            busNumber: bus.busNumber
                        });
                        
                    //Error updating the client..
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Error creating the bus.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Updating buses.
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.busID;
        
        // See if the current user can edit this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            
            //If the bus ID matches an ID in their user object, grant them access.
            if(req.user.transportsCreated[i].ID === id) {
                allowed = true;
            }
        }
        
        //Else, not allowed to edit.
        if(allowed === false) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "You are not permitted to edit this bus.", 403));
        }
        
        var acceptedInputs = ['arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        
        //Create a new JSON document of the requests.
        var newDoc = {};
        for(var request in req.body) {
            if(acceptedInputs.indexOf(request) !== -1) {
                newDoc[request] = req.body[request];
            } else{
                return res.status(400).json(cj.createCjError(base, "Invalid attribute to edit.", 400));
            }
        }
        
        //Update the Bus model.
        Bus.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No errors and updated document received.
            if(!err && updatedDoc[0]) {
                
                //Send a response.
                res.setHeader("Location", base + "/api/bus/" + updatedDoc[0].id);
                res.status(200).json({
                    message: "Bus updated: " + updatedDoc[0].id
                });
                
                //For subscribed sockets - send the updated bus data.
                Bus.publishUpdate(updatedDoc[0].id, {
                    latitude: updatedDoc[0].latitude,
                    longitude: updatedDoc[0].longitude,
                    busNumber: updatedDoc[0].busNumber
                });
            
            //No updated document returned.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
                
            //Error returned.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting buses.
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.busID;
        
        // See if the current client can delete this
        var allowed = false;
        for(var i = 0; i < req.user.transportsCreated.length; i++) {
            
            //If the bus ID matches an ID in their client object, grant them access.
            if(req.user.transportsCreated[i].ID === id) {
                allowed = true;
            }
            
        }
        
        //Else, not allowed access.
        if(allowed === false) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(403).json(cj.createCjError(base, "You are not permitted to delete this bus.", 403));
        }
        
        //See if the bus ID is valid.
        Bus.findOne({
            id: id
        }, function(err, doc) {
            
            //No error, and found a bus. Proceed with deletion.
            if(!err && doc) {
                Bus.destroy({
                    id: id
                }).exec(function(err) {
                    
                    //No problems.
                    if(!err) {
                        
                        //Remove the deleted bus from the users transports created object.
                        var newDoc = req.user.transportsCreated;
                        for(var i = 0; i < newDoc.length; i++) {
                            if(newDoc[i].ID === id) {
                                newDoc.splice(i, 1);
                            }
                        }
                        
                        //Update the User model.
                        Users.update({
                            id: req.user.id
                        }, {transportsCreated: newDoc}).exec(function(err, updatedDoc) {
                            
                            //No problems.
                            if(!err) {
                                
                                //Send the response.
                                res.status(200).json({
                                    message: "Bus successfully removed."
                                });
                                
                                //For subscribed sockets - inform of bus deletion.
                                Bus.publishDestroy(id);
                            
                            //Error updating the client object.
                            } else {
                                res.setHeader("Content-Type", "application/vnd.collection+json");
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        });
                    
                    //Error deleting the bus.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Bus ID not found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
                
            //Error searching for bus ID.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Searching for buses.
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        
        //See if the search by matches any of the following values - if it doesn't, produce an error.
        var acceptedSearchByInputs = ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude'];
        if(acceptedSearchByInputs.indexOf(searchBy) === -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(400).json(cj.createCjError(base, "Search By value not permitted.", 400));
        }
        
        //Create a search query.
        var search = {};
        search[searchBy] = criteria;
        
        //Search the model.
        Bus.find().where(search).limit(20).exec(function(err, results) {
            
            //No error and results found.
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://schema.org/BusTrip>; rel="profile", <https://schema.org/GeoCoordinates>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
                
            //No error, but no results found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No search results found.", 404));
                
            //Error searching for buses.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    }
};