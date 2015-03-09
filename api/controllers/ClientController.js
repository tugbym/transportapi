/**
 * ClientController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var cj = require('../services/CjTemplate.js')('client', ['id', 'name', 'redirectURI', 'clientId', 'clientSecret', 'trusted']);
module.exports = {
    create: function(req, res) {
        var name = req.body.name;
        var redirectURI = req.body.redirectURI;
        Client.create({
            name: name,
            redirectURI: redirectURI
        }).exec(function(err, client) {
            if(err) {
                res.status(500).json("Error creating client: " + err);
            } else {
                res.status(201).json({
                    message: "Client created: " + client.name,
                    clientId: client.clientId,
                    clientSecret: client.clientSecret
                });
            }
        });
    },
    view: function(req, res) {
        Users.findOne({
            nickname: "admin"
        }).exec(function(err, admin) {
            if(!err && admin) {
                if(admin.id == req.user.id) {
                    // Admin detected.
                    var id = req.params.id;
                    var query = {};
                    if (id) {
                        query = {id: id};
                    }
                    Client.find(query, function(err, clients) {
                        if(err) {
                            res.status(500).json({
                                error: err.message
                            });
                        } else if (!clients[0]) {
                            res.status(404).json({message: "Client(s) not found."});
                        } else {
                            res.status(200).json(clients);
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Admin not logged in."
                    });
                }
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find admin account."
                });
            } else {
                res.status(500).json({
                    message: "Problem finding admin account."
                });
            }
        });
    },
    update: function(req, res) {
        Users.findOne({
            nickname: "admin"
        }).exec(function(err, admin) {
            if(!err && admin) {
                if(admin.id == req.user.id) {
                    var id = req.params.id;
                    var newDoc = {};
                    var acceptedEditInputs = ['name', 'redirectURI', 'trusted'];
                    for(request in req.body) {
                        if(acceptedEditInputs.indexOf(request) == -1) {
                            var base = 'http://' + req.headers.host;
                            res.setHeader("Content-Type", "application/vnd.collection+json");
                            return res.status(403).json(cj.createCjError(base, "You may only edit the name, redirectURI and trusted values.", 403));
                        }
                        newDoc[request] = req.body[request]
                    }
                    Client.update({
                        id: id
                    }, newDoc).exec(function(err, updatedDoc) {
                        if(!err && updatedDoc[0]) {
                            res.status(200).json({
                                message: "Client updated: " + updatedDoc[0].name
                            });
                        } else if (!err) {
                            res.status(404).json({message: "Client not found."});
                        } else {
                            res.status(500).json({
                                message: "Could not update client: " + err
                            });
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Admin not logged in."
                    });
                }
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find admin account."
                });
            } else {
                res.status(500).json({
                    message: "Problem finding admin account."
                });
            }
        });
    },
    delete: function(req, res) {
        Users.findOne({
            nickname: "admin"
        }).exec(function(err, admin) {
            if(!err && admin) {
                if(admin.id == req.user.id) {
                    var id = req.params.id;
                    Client.findOne({
                        id: id
                    }, function(err, doc) {
                        if(!err && doc) {
                            Client.destroy(doc).exec(function(err) {
                                if(!err) {
                                    res.status(200).json({
                                        message: "Client successfully removed."
                                    });
                                } else {
                                    res.status(403).json({
                                        message: "Could not delete client: " + err
                                    });
                                }
                            })
                        } else if(!err) {
                            res.status(404).json({
                                message: "Could not find client."
                            });
                        } else {
                            res.status(403).json({
                                message: "Could not get client: " + err
                            });
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Admin not logged in."
                    });
                }
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find admin account."
                });
            } else {
                res.status(500).json({
                    message: "Problem finding admin account."
                });
            }
        });
    },
    search: function(req, res) {
        Users.findOne({
            nickname: "admin"
        }).exec(function(err, admin) {
            if(!err && admin) {
                if(admin.id == req.user.id) {
                    var criteria = req.body.search.toString();
                    var searchBy = req.body.searchBy.toString();
                    var base = 'http://' + req.headers.host;
                    var acceptedSearchByInputs = ['name', 'redirectURI'];
                    if(acceptedSearchByInputs.indexOf(searchBy) == -1) {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        return res.status(403).json(cj.createCjError(base, "Search By value not permitted.", 403));
                    }
                    var search = {};
                    search[searchBy] = criteria;
                    Client.find().where(search).limit(20).exec(function(err, results) {
                        if(!err && results[0]) {
                            res.setHeader("Content-Type", "application/vnd.collection+json");
                            res.status(200).json(cj.createCjTemplate(base, results));
                        } else if(!err) {
                            res.setHeader("Content-Type", "application/vnd.collection+json");
                            res.status(404).json(cj.createCjError(base, "No search results found.", 404));
                        } else {
                            res.setHeader("Content-Type", "application/vnd.collection+json");
                            res.status(500).json(cj.createCjError(base, err, 500));
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Admin not logged in."
                    });
                }
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find admin account."
                });
            } else {
                res.status(500).json({
                    message: "Problem finding admin account"
                });
            }
        });
    },
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ClientController)
     */
    _config: {}
};