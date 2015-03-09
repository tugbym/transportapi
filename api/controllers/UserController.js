/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js') ('user', ['id', 'name', 'nickname', 'photo', 'email', 'bday'], ['password', 'friends'] );

module.exports = {    
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
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
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.setHeader('Link', '<http://microformats.org/wiki/h-card>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, doc));
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var name = req.body.name;
        var username = req.body.username;
        var photo = req.body.photo;
        var email = req.body.email;
        var bday = req.body.bday;
        var password = req.body.password;
        Users.findOne({
            nickname: username
        }, function(err, doc) {
            if(!err && !doc) {
                Users.create({
                    name: name,
                    nickname: username,
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
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
            } else if(!err) {
                res.status(403).json(cj.createCjError(base, "User with that name already exists.", 403));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var id = req.user.id;
        var acceptedEditInputs = ['name', 'nickname', 'photo', 'email', 'bday', 'password'];
        
        var newDoc = {};
        for(request in req.body) {
            if (acceptedEditInputs.indexOf(request) == -1) {
                return res.status(403).json(cj.createCjError(base, "Edit value not permitted", 403));
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
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        
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
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
            } else {
                res.status(403).json(cj.createCjError(base, err, 403));
            }
        });
    },
    addFriend: function(req, res) {
        var base = 'http://' + req.headers.host;
        
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
                                    return res.status(500).json(cj.createCjError(base, err, 500));
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
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        })
                    } else if(!err) {
                        res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
                    } else {
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find friend.", 404));
            } else {
                res.status(403).json(cj.createCjError(base, err, 403));
            }
        });
    },
    removeFriend: function(req, res) {
        var base = 'http://' + req.headers.host;
        
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
                                        return res.status(500).json(cj.createCjError(base, err, 500));
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
                                res.status(500).json(cj.createCjError(base, err, 500));
                            }
                        })
                    } else if(!err) {
                        res.status(404).json(cj.createCjError(base, "Could not find user.", 404));
                    } else {
                        res.status(403).json(cj.createCjError(base, err, 403));
                    }
                })
            } else if(!err) {
                res.status(404).json(cj.createCjError(base, "Could not find friend.", 404));
            } else {
                res.status(403).json(cj.createCjError(base, err, 500));
            }
        });
    },
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var criteria = req.body.search.toString();
        var searchBy = req.body.searchBy.toString();
        
        var acceptedSearchByInputs = ['name', 'nickname', 'photo', 'email', 'bday'];
        
        if (acceptedSearchByInputs.indexOf(searchBy) == -1) {
            return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
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
                res.setHeader('Link', '<http://microformats.org/wiki/h-card>; rel="profile"');
                res.status(200).json(cj.createCjTemplate(base, results));
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "No results found.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    },
    addBus: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var busID = req.params.id;
        var userID = req.session.user;
        
        Bus.findOne({id: busID}, function(err, bus) {
            if (!err && bus) {
                Users.update({id: userID}, {transportID: busID, transportType: "bus"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on bus ID: " + busID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    deleteBus: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var busID = req.params.id;
        var userID = req.session.user;
        
        Bus.findOne({id: busID}, function(err, bus) {
            if (!err && bus) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on bus ID: " + busID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find bus.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    },
    addTrain: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var trainID = req.params.id;
        var userID = req.session.user;
        
        Train.findOne({id: trainID}, function(err, train) {
            if (!err && train) {
                Users.update({id: userID}, {transportID: trainID, transportType: "train"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on train ID: " + trainID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    deleteTrain: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var trainID = req.params.id;
        var userID = req.session.user;
        
        Train.findOne({id: trainID}, function(err, train) {
            if (!err && train) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on train ID: " + busID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find train.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    },
    addFlight: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var flightID = req.params.id;
        var userID = req.session.user;
        
        Flight.findOne({id: flightID}, function(err, flight) {
            if (!err && flight) {
                Users.update({id: userID}, {transportID: flightID, transportType: "flight"}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " now on flight ID: " + flightID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    deleteFlight: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        var flightID = req.params.id;
        var userID = req.session.user;
        
        Flight.findOne({id: flightID}, function(err,  flight) {
            if (!err && flight) {
                Users.update({id: userID}, {transportID: undefined, transportType: undefined}).exec(function(err, updatedDoc) {
                    if (!err) {
                        res.status(200).json({message: "User ID: " + userID + " no longer on flight ID: " + flightID});
                    } else {
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                })
            } else if (!err) {
                res.status(404).json(cj.createCjError(base, "Could not find flight.", 404));
            } else {
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        })
    }
};