/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js') ('user', ['id', 'name', 'nickname', 'photo', 'email', 'bday'], ['password', 'friends'] );

module.exports = {    
    read: function(req, res) {
        var id;
        if(req.params.id) {
            id = req.params.id;
        } else {
            id = req.user.id;
        }
        Users.findOne({
            id: id
        }).exec(function(err, doc) {
            if(!err && doc) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, doc));
            } else if(!err) {
                res.status(404).json({message: "User not found."});
            } else {
                res.status(500).json({
                    message: err
                });
            }
        });
    },
    create: function(req, res) {
        var name = req.body.name;
        var nickname = req.body.nickname;
        var photo = req.body.photo;
        var email = req.body.email;
        var bday = req.body.bday;
        var password = req.body.password;
        Users.findOne({
            nickname: {
                $regex: new RegExp(nickname, "i")
            }
        }, function(err, doc) {
            if(!err && !doc) {
                Users.create({
                    name: name,
                    nickname: nickname,
                    photo: photo,
                    email: email,
                    bday: new Date(bday),
                    password: password,
                    friends: []
                }).exec(function(err, user) {
                    if(!err) {
                        res.status(201).json({
                            message: "New User created.", id: user.id
                        });
                    } else {
                        res.status(500).json({
                            message: "Could not create user. Error: " + err
                        });
                    }
                });
            } else if(!err) {
                res.status(403).json({
                    message: "User with that name already exists."
                });
            } else {
                res.status(500).json({
                    message: "Could not create user. Error: " + err
                });
            }
        });
    },
    update: function(req, res) {
        var id = req.user.id;
        var acceptedEditInputs = ['name', 'nickname', 'photo', 'email', 'bday', 'password'];
        
        var newDoc = {};
        for(request in req.body) {
            if (acceptedEditInputs.indexOf(request) == -1) {
                return res.status(403).json({message: "Edit value not permitted."});
            }
            newDoc[request] = req.body[request]
        }
        Users.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err && updatedDoc[0]) {
                res.status(200).json({
                    message: "User updated: " + updatedDoc[0].nickname
                });
            } else {
                res.status(500).json({
                    message: "Could not update user: " + err
                });
            }
        });
    },
    delete: function(req, res) {
        var id = req.user.id;
        
        Users.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Users.destroy({id: id}).exec(function(err, user) {
                    if(!err) {
                        res.status(200).json({
                            message: "User successfully removed."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not delete user: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find user."
                });
            } else {
                res.status(403).json({
                    message: "Could not delete user: " + err
                });
            }
        });
    },
    addFriend: function(req, res) {
        var id = req.session.user;
        var friend = req.params.name;
        Users.findOne({
            nickname: friend
        }, function(err, friendReq) {
            if(!err && friendReq) {
                Users.findOne({
                    id: id
                }, function(err, user) {
                    if(!err && user) {
                        var nickname = user.nickname;
                        var mutual = false;
                        var friendsList = friendReq.friends;
                        var yourList = user.friends;
                        for(var i = 0; i < friendsList.length; i++) {
                            if(friendsList[i].user == nickname) {
                                friendsList.splice(i, 1);
                                mutual = true;
                            }
                        }
                        for(var i = 0; i < yourList.length; i++) {
                            if(yourList[i].user == friend) {
                                yourList.splice(i, 1);
                            }
                        }
                        var newFriend = {
                            user: friend,
                            mutual: mutual,
                            userID: friendReq.id
                        };
                        yourList.push(newFriend);
                        if(mutual) {
                            newFriend = {
                                user: nickname,
                                mutual: mutual,
                                userID: id
                            };
                            friendsList.push(newFriend);
                            Users.update({
                                id: friendReq.id
                            }, {
                                friends: friendsList
                            }).exec(function(err, updatedDoc) {
                                if(err) {
                                    return res.status(500).json({
                                        message: "Could not update friend's profile: " + err
                                    });
                                }
                            })
                        }
                        Users.update({
                            id: id
                        }, {
                            friends: yourList
                        }).exec(function(err, updatedDoc) {
                            if(!err) {
                                res.status(200).json({
                                    message: "Friend added: " + friend
                                });
                            } else {
                                res.status(500).json({
                                    message: "Could not add friend: " + err
                                });
                            }
                        })
                    } else if(!err) {
                        res.status(404).json({
                            message: "Could not find user."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not get user: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find user requested."
                });
            } else {
                res.status(403).json({
                    message: "Could not get requested user: " + err
                });
            }
        });
    },
    removeFriend: function(req, res) {
        var id = req.session.user;
        var friend = req.params.name;
        Users.findOne({
            nickname: friend
        }, function(err, friendReq) {
            if(!err && friendReq) {
                Users.findOne({
                    id: id
                }, function(err, user) {
                    if(!err && user) {
                        var nickname = user.nickname;
                        var mutual;
                        if(friendReq.friends) {
                            var friendsList = friendReq.friends;
                            for(var i = 0; i < friendsList.length; i++) {
                                if(friendsList[i].user == nickname) {
                                    friendsList.splice(i, 1);
                                    mutual = true;
                                }
                            }
                            if(mutual) {
                                Users.update({
                                    id: friendReq.id
                                }, {
                                    friends: friendsList
                                }).exec(function(err, updatedDoc) {
                                    if(err) {
                                        return res.status(500).json({
                                            message: "Could not update friend's profile: " + err
                                        });
                                    }
                                })
                            }
                        }
                        Users.update({
                            id: id
                        }, {
                            friends: friendsList
                        }).exec(function(err, updatedDoc) {
                            if(!err) {
                                res.status(200).json({
                                    message: "Friend deleted: " + friend
                                });
                            } else {
                                res.status(500).json({
                                    message: "Could not delete friend: " + err
                                });
                            }
                        })
                    } else if(!err) {
                        res.status(404).json({
                            message: "Could not find user."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not get user: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find user requested."
                });
            } else {
                res.status(403).json({
                    message: "Could not get requested user: " + err
                });
            }
        });
    },
    search: function(req, res) {
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        
        var acceptedSearchByInputs = ['name', 'nickname', 'photo', 'email', 'bday'];
        
        if (acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json({message: "Search By value not permitted."});
        }
        
        var search = {};
        search[searchBy] = criteria;
        
        Users.find()
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
    },
    addBus: function(req, res) {
        var busID = req.params.id;
        var userID = req.session.user;
        
        Bus.findOne({id: busID}, function(err, bus) {
            if (!err && bus) {
                Users.update({id: userID}, {transportID: busID, transportType: "bus"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on bus ID: " + busID});
                    } else {
                        res.status(500).json({message: "Error saving bus: " + err});
                    }
                });
            } else if (!err) {
                res.status(404).json({message: "No bus found."});
            } else {
                res.status(500).json({message: "Error getting bus: " + err});
            }
        });
    },
    deleteBus: function(req, res) {
        var busID = req.params.id;
        var userID = req.session.user;
        
        Bus.findOne({id: busID}, function(err, bus) {
            if (!err && bus) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on bus ID: " + busID});
                    } else {
                        res.status(500).json({message: "Error deleting bus: " + err});
                    }
                })
            } else if (!err) {
                res.status(404).json({message: "No bus found."});
            } else {
                res.status(500).json({message: "Error getting bus: " + err});
            }
        })
    },
    addTrain: function(req, res) {
        var trainID = req.params.id;
        var userID = req.session.user;
        
        Train.findOne({id: trainID}, function(err, train) {
            if (!err && train) {
                Users.update({id: userID}, {transportID: trainID, transportType: "train"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on train ID: " + trainID});
                    } else {
                        res.status(500).json({message: "Error saving train: " + err});
                    }
                });
            } else if (!err) {
                res.status(404).json({message: "No train found."});
            } else {
                res.status(500).json({message: "Error getting train: " + err});
            }
        });
    },
    deleteTrain: function(req, res) {
        var trainID = req.params.id;
        var userID = req.session.user;
        
        Train.findOne({id: trainID}, function(err, train) {
            if (!err && train) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on train ID: " + busID});
                    } else {
                        res.status(500).json({message: "Error deleting train: " + err});
                    }
                })
            } else if (!err) {
                res.status(404).json({message: "No train found."});
            } else {
                res.status(500).json({message: "Error getting train: " + err});
            }
        })
    },
    addFlight: function(req, res) {
        var flightID = req.params.id;
        var userID = req.session.user;
        
        Flight.findOne({id: flightID}, function(err, flight) {
            if (!err && flight) {
                Users.update({id: userID}, {transportID: flightID, transportType: "flight"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on flight ID: " + flightID});
                    } else {
                        res.status(500).json({message: "Error saving flight: " + err});
                    }
                });
            } else if (!err) {
                res.status(404).json({message: "No flight found."});
            } else {
                res.status(500).json({message: "Error getting flight: " + err});
            }
        });
    },
    deleteFlight: function(req, res) {
        var flightID = req.params.id;
        var userID = req.session.user;
        
        Flight.findOne({id: flightID}, function(err,  flight) {
            if (!err && flight) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on flight ID: " + flightID});
                    } else {
                        res.status(500).json({message: "Error deleting flight: " + err});
                    }
                })
            } else if (!err) {
                res.status(404).json({message: "No flight found."});
            } else {
                res.status(500).json({message: "Error getting flight: " + err});
            }
        })
    }
};