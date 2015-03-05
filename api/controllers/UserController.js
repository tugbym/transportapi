/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    read: function(req, res) {
        Users.findOne({
            id: req.session.user
        }).exec(function(err, docs) {
            if(!err) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(createCjTemplate(base, docs));
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
                            message: "New User created: " + user.nickname
                        });
                    } else {
                        res.status(500).json({
                            message: "Could not create user. Error: " + err
                        });
                    }
                });
            } else if(!err) {
                res.status(403).json({
                    message: "User with that name already exists, please use PUT instead, or use another name."
                });
            } else {
                res.status(500).json({
                    message: "Could not create user. Error: " + err
                });
            }
        });
    },
    update: function(req, res) {
        var id = req.session.user;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Users.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err) {
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
        var id = req.session.user;
        Users.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                Users.destroy(doc).exec(function(err) {
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
    }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/user';
    cj.collection.links = [];
    cj.collection.links.push({
        'rel': 'home',
        'href': base
    });
    cj.collection.items = [];
    if(docs.length) {
        renderUsers(cj, base, docs);
    } else {
        renderUser(cj, base, docs);
    }
    cj.collection.items.links = [];
    cj.collection.queries = [];
    cj.collection.queries.push({
        'rel': 'search',
        'href': base + '/user/search',
        'prompt': 'Search',
        'data': [{
            'name': 'search',
            'value': ''
        }]
    });
    cj.collection.template = {};
    cj.collection.template.data = [];
    renderTemplate(cj, docs);
    return cj;
}

function renderUsers(cj, base, docs) {
    for(var i = 0; i < docs.length; i++) {
        item = {};
        item.href = base + '/user/' + docs[i].id;
        item.data = [];
        item.links = [];
        var p = 0;
        var values = ['name', 'nickname', 'photo', 'email', 'bday'];
        for(var d in docs[i]) {
            if(values.indexOf(d) != -1) {
                item.data[p++] = {
                    'name': d,
                    'value': docs[i][d],
                    'prompt': d
                };
            }
        }
        var friends = docs[i].friends;
        for(var q in friends) {
            if(friends[q].mutual) {
                item.links[q] = {
                    'rel': 'friend',
                    'href': base + '/user/' + friends[q].userID,
                    'prompt': 'Friend'
                }
            }
        }
        cj.collection.items.push(item);
    }
}

function renderUser(cj, base, docs) {
    item = {};
    item.href = base + '/user/' + docs.id;
    item.data = [];
    item.links = [];
    var p = 0;
    var values = ['name', 'nickname', 'photo', 'email', 'bday'];
    for(var d in docs) {
        if(values.indexOf(d) != -1) {
            item.data[p++] = {
                'name': d,
                'value': docs[d],
                'prompt': d
            };
        }
    }
    var friends = docs.friends;
    for(var q in friends) {
        if(friends[q].mutual) {
            item.links[q] = {
                'rel': 'friend',
                'href': base + '/user/' + friends[q].userID,
                'prompt': 'Friend'
            }
        }
    }
    cj.collection.items.push(item);
}

function renderTemplate(cj, docs) {
    item = {};
    var values = ['name', 'nickname', 'photo', 'email', 'bday', 'password', 'friends'];
    for (var i=0; i<values.length; i++) {
        if (values[i] == 'friends') {
            item = {
            'name': values[i],
            'value': [{
                'user': '',
                'mutual': '',
                'userID': ''
            }],
            'prompt': values[i]
            }
        } else {
        item = {
            'name': values[i],
            'value': '',
            'prompt': values[i]
        }
        }
        cj.collection.template.data.push(item);
    }
}