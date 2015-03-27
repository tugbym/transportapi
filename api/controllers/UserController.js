/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js')('user', ['id', 'name', 'nickname', 'photo', 'email', 'bday'], ['password', 'friends']);
var passport = require('passport');

module.exports = {
    
    //Getting user data.
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //If there was a parameter, search for that. Else, search for the currently logged in user.
        var id;
        if(req.params.userID) {
            id = req.params.userID;
        } else {
            id = req.user.id;
        }
        
        //Search the User model.
        Users.findOne({
            id: id
        }).exec(function(err, doc) {
            
            //No problems.
            if(!err && doc) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://microformats.org/wiki/h-card>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, doc));
                
            //No users found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
                
            //Error searching for users.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Getting all user data.
    readAll: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //Search the user model.
        Users.find({}).exec(function(err, doc) {
            
            //No problems.
            if(!err && doc) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://microformats.org/wiki/h-card>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, doc));
                
            //No users found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find any users.", 404));
                
            //Error searching for users.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Creating a new user.
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //Get the request data.
        var name = req.body.name;
        var username = req.body.username;
        var email = req.body.email;
        var bday = req.body.bday;
        var password = req.body.password;
        
        //See if the username already exists.
        Users.findOne({
            nickname: username
        }, function(err, doc) {
            
            //No username found, proceed with creation.
            if(!err && !doc) {
                Users.create({
                    name: name,
                    nickname: username,
                    email: email,
                    bday: new Date(bday),
                    password: password,
                    friends: []
                }).exec(function(err, user) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + user.id);
                        res.status(201).json({
                            message: "New User created: " + user.id
                        });
                        
                    //Error creating user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Username already exists.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(409).json(cj.createCjError(base, "User with that name already exists.", 409));
                
            //Error searching for user.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Updating the currently logged in user.
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.user.id;
        
        //See if the request is valid.
        var acceptedEditInputs = ['name', 'email', 'bday', 'password'];
        var newDoc = {};
        for(var request in req.body) {
            
            //Invalid request.
            if(acceptedEditInputs.indexOf(request) === -1) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(400).json(cj.createCjError(base, "You may only edit your name, email, date of birth and password.", 400));
            }
            
            //Valid request.
            newDoc[request] = req.body[request];
        }
        
        //Update the user model.
        Users.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No problems.
            if(!err && updatedDoc[0]) {
                res.setHeader("Location", base + "/api/user/" + updatedDoc[0].id);
                res.status(200).json({
                    message: "User updated: " + updatedDoc[0].id
                });
                
            //Error updating the user.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Update a user.
    updateOne: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.userID;
        
        //See if the request is valid.
        var acceptedEditInputs = ['name', 'email', 'bday', 'password'];
        var newDoc = {};
        for(var request in req.body) {
            
            //Invalid request.
            if(acceptedEditInputs.indexOf(request) === -1) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(400).json(cj.createCjError(base, "You may only edit your name, email, date of birth and password.", 400));
            }
            
            //Valid request.
            newDoc[request] = req.body[request];
        }
        
        //Update the user.
        Users.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No problems.
            if(!err && updatedDoc[0]) {
                res.setHeader("Location", base + "/api/user/" + user.id);
                res.status(200).json({
                    message: "User updated: " + updatedDoc[0].id
                });
                
            //No user found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No user found.", 404));
                
            //Error updating user.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting the currently logged in user.
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.user.id;
        
        //Logout the user first.
        req.logout();
        
        //Delete the user.
        Users.destroy({
            id: id
        }).exec(function(err, user) {
            
            //No problems.
            if(!err) {
                res.status(200).json({
                    message: "User successfully removed."
                });
                
            //Error deleting the user.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Deleting a user.
    deleteOne: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.userID;
        
        //If the user being deleted matches the one logged in, log them out.
        if (req.params.id === req.user.id) {
            req.logout();
        }
        
        //See if the user ID is valid.
        Users.findOne({
            id: id
        }, function(err, doc) {
            
            //User ID is valid, so proceed with deletion.
            if(!err && doc) {
                Users.destroy({
                    id: id
                }).exec(function(err, user) {
                    
                    //No problems.
                    if(!err) {
                        res.status(200).json({
                            message: "User successfully removed."
                        });
                        
                    //Error deleting user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No user found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
                
            //Error searching for user.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Add a friend to the currently logged in user.
    addFriend: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.user.id;
        var friend = req.params.username;
        
        //See if the friend is valid.
        Users.findOne({
            nickname: friend
        }, function(err, friendReq) {
            
            //Friend is valid.
            if(!err && friendReq) {
                
                //Get the current user.
                Users.findOne({
                    id: id
                }, function(err, user) {
                    
                    //No problems.
                    if(!err && user) {
                        var nickname = user.nickname;
                        var mutual = false;
                        
                        //Get the two friend lists as they stand.
                        var friendsList = friendReq.friends;
                        var yourList = user.friends;
                        
                        //If you are on your friends friends list, remove it, to avoid duplicates and set mutual to true.
                        for(var i = 0; i < friendsList.length; i++) {
                            if(friendsList[i].user === nickname) {
                                friendsList.splice(i, 1);
                                mutual = true;
                            }
                        }
                        
                        //If your friend is on your list, remove it, to avoid duplicates.
                        for(i = 0; i < yourList.length; i++) {
                            if(yourList[i].user === friend) {
                                yourList.splice(i, 1);
                            }
                        }
                        
                        //Create a new friend object.
                        var newFriend = {
                            user: friend,
                            mutual: mutual,
                            userID: friendReq.id
                        };
                        yourList.push(newFriend);
                        
                        //If you were on your friends friends list.
                        if(mutual) {
                            
                            //Update their friends list.
                            newFriend = {
                                user: nickname,
                                mutual: mutual,
                                userID: id
                            };
                            friendsList.push(newFriend);
                            
                            //And push the changes to their user model.
                            Users.update({
                                id: friendReq.id
                            }, {
                                friends: friendsList
                            }).exec(function(err, updatedDoc) {
                                
                                //Error updating friends document.
                                if(err) {
                                    res.setHeader("Content-Type", "application/vnd.collection+json");
                                    return res.status(500).json(cj.createCjError(base, err, 500));
                                }
                            });
                        }
                        
                        //Update your user model with the new friends list.
                        Users.update({
                            id: id
                        }, {
                            friends: yourList
                        }).exec(function(err, updatedDoc) {
                            
                            //No problems.
                            if(!err) {
                                res.setHeader("Location", base + "/api/user/" + updatedDoc[0].id);
                                res.status(200).json({
                                    message: "Friend added: " + friend
                                });
                                
                            //Error updating user.
                            } else {
                                res.setHeader("Content-Type", "application/vnd.collection+json");
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        });
                        
                    //Error finding user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No friend found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find friend.", 404));
                
            //Error searching for friend.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Removing a friend from the currently logged in user.
    removeFriend: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.user.id;
        var friend = req.params.username;
        
        //See if the friend is valid.
        Users.findOne({
            nickname: friend
        }, function(err, friendReq) {
            
            //Friend is valid.
            if(!err && friendReq) {
                
                //Get your user document.
                Users.findOne({
                    id: id
                }, function(err, user) {
                    
                    //No problems.
                    if(!err && user) {
                        var nickname = user.nickname;
                        var mutual;
                        var myList;
                        if(friendReq.friends) {
                            var friendsList = friendReq.friends;
                            myList = user.friends;
                            
                            //If you were on your friends friends list, set their mutual property to false.
                            for(var i = 0; i < friendsList.length; i++) {
                                if(friendsList[i].user === nickname) {
                                    friendsList[i].mutual = false;
                                }
                            }
                            
                            //Delete the friend from your list.
                            for (var j = 0; j < myList.length; j++) {
                                if(myList[j].user === friend) {
                                    myList.splice(j, 1);
                                }
                            }
                            
                            //Update friends document with the new list.
                            Users.update({
                                id: friendReq.id
                            }, {
                                friends: friendsList
                            }).exec(function(err, updatedDoc) {
                                
                                //Error updating friends document.
                                if(err) {
                                    res.setHeader("Content-Type", "application/vnd.collection+json");
                                    return res.status(500).json(cj.createCjError(base, err, 500));
                                }
                            });
                        }
                        
                        //Update your user model.
                        Users.update({
                            id: id
                        }, {
                            friends: myList
                        }).exec(function(err, updatedDoc) {
                            
                            //No problems.
                            if(!err) {
                                res.setHeader("Location", base + "/api/user/" + updatedDoc[0].id);
                                res.status(200).json({
                                    message: "Friend deleted: " + friend
                                });
                                
                            //Error updating your user model.
                            } else {
                                res.setHeader("Content-Type", "application/vnd.collection+json");
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        });
                        
                    //Error searching for user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Friend not found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find friend.", 404));
                
            //Error searching for friend.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Searching for users.
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        
        //See if request is valid, if not, send 400.
        var acceptedSearchByInputs = ['id', 'name', 'nickname', 'email', 'bday'];
        if(acceptedSearchByInputs.indexOf(searchBy) === -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(400).json(cj.createCjError(base, "Search By value not permitted.", 400));
        }
        
        //Create search query.
        var search = {};
        search[searchBy] = criteria;
        
        //Search the Users model.
        Users.find().where(search).limit(20).exec(function(err, results) {
            var base = 'http://' + req.headers.host;
            
            //No problems.
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://microformats.org/wiki/h-card>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
                
            //No users found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
                
            //Error searching for users.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Adding a Bus to the currently logged in user.
    addBus: function(req, res) {
        var base = 'http://' + req.headers.host;
        var busID = req.params.busID;
        var userID = req.user.id;
        
        //See if the bus ID is valid.
        Bus.findOne({
            id: busID
        }, function(err, bus) {
            
            //Valid Bus ID, so proceed with update.
            if(!err && bus) {
                
                //Update the users model.
                Users.update({
                    id: userID
                }, {
                    transportID: busID,
                    transportType: "bus"
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated.",
                            busID: busID,
                            busNumber: bus.busNumber
                        });
                        
                    //Error updating the users model.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No bus found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
                
            //Error searching for bus.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting a Bus from the currently logged in user.
    deleteBus: function(req, res) {
        var base = 'http://' + req.headers.host;
        var busID = req.params.busID;
        var userID = req.user.id;
        
        //See if the bus ID is valid.
        Bus.findOne({
            id: busID
        }, function(err, bus) {
            
            //Bus ID is valid.
            if(!err && bus) {
                
                //Update the users model.
                Users.update({
                    id: userID
                }, {
                    transportID: undefined,
                    transportType: undefined
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated. No longer on bus: " + bus.busNumber,
                            busID: busID,
                            busNumber: bus.busNumber
                        });
                        
                    //Error updating user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No bus found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
                
            //Error searching for bus.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Adding a Train to the currently logged in user.
    addTrain: function(req, res) {
        var base = 'http://' + req.headers.host;
        var trainID = req.params.trainID;
        var userID = req.user.id;
        
        //See if the train ID is valid.
        Train.findOne({
            id: trainID
        }, function(err, train) {
            
            //Train ID is valid.
            if(!err && train) {
                
                //Update the user model.
                Users.update({
                    id: userID
                }, {
                    transportID: trainID,
                    transportType: "train"
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated.",
                            trainID: trainID,
                            trainNumber: train.trainNumber
                        });
                        
                    //Error updating the user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No train found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
                
            //Error searching for trains.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting a Train from the currently logged in user.
    deleteTrain: function(req, res) {
        var base = 'http://' + req.headers.host;
        var trainID = req.params.trainID;
        var userID = req.user.id;
        
        //See if the train ID is valid.
        Train.findOne({
            id: trainID
        }, function(err, train) {
            
            //Train ID is valid.
            if(!err && train) {
                
                //Update the user model.
                Users.update({
                    id: userID
                }, {
                    transportID: undefined,
                    transportType: undefined
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated. No longer on train: " + train.trainNumber,
                            trainID: trainID,
                            trainNumber: train.trainNumber
                        });
                        
                    //Error updating the user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Train not found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
                
            //Error searching for trains.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Add a Flight to the currently logged in user.
    addFlight: function(req, res) {
        var base = 'http://' + req.headers.host;
        var flightID = req.params.flightID;
        var userID = req.user.id;
        
        //See if the flight ID is valid.
        Flight.findOne({
            id: flightID
        }, function(err, flight) {
            
            //Flight ID is valid.
            if(!err && flight) {
                Users.update({
                    id: userID
                }, {
                    transportID: flightID,
                    transportType: "flight"
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated.",
                            flightID: flightID,
                            flightNumber: flight.flightNumber
                        });
                        
                    //Error updating the user.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No flight found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
                
            //Error searching for flights.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //Deleting a Flight from the currently logged in user.
    deleteFlight: function(req, res) {
        var base = 'http://' + req.headers.host;
        var flightID = req.params.flightID;
        var userID = req.user.id;
        
        //See if the flight ID is valid.
        Flight.findOne({
            id: flightID
        }, function(err, flight) {
            
            //Flight ID is valid.
            if(!err && flight) {
                
                //Update the user model.
                Users.update({
                    id: userID
                }, {
                    transportID: undefined,
                    transportType: undefined
                }).exec(function(err, updatedDoc) {
                    
                    //No problems.
                    if(!err) {
                        res.setHeader("Location", base + "/api/user/" + userID);
                        res.status(200).json({
                            message: "User ID: " + userID + "updated. No longer on flight: " + flight.flightNumber,
                            flightID: flightID,
                            flightNumber: flight.flightNumber
                        });
                        
                    //Error updating the user model.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //Flight not found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
                
            //Error searching for flight.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    }
};