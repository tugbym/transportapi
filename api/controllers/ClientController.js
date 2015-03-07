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
                res.status(201).json({message: "Client created: " + client.name, clientId: client.clientId, clientSecret: client.clientSecret});
            }
        });
    },
    view: function(req, res) {
        Users.findOne({
            nickname: "admin"
        }).exec(function(err, admin) {
            if(!err && admin) {
                if(admin.id == req.session.user) {
                    // Admin detected.
                    Client.find({}, function(err, clients) {
                        if(err) {
                            res.status(500).json({
                                error: err.message
                            });
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
                if(admin.id == req.session.user) {
                    var id = req.params.id;
                    var newDoc = {};
                    for(request in req.body) {
                        newDoc[request] = req.body[request]
                    }
                    Client.update({
                        id: id
                    }, newDoc).exec(function(err, updatedDoc) {
                        if(!err) {
                            res.status(200).json({
                                message: "Client updated: " + updatedDoc[0].name
                            });
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
                if(admin.id == req.session.user) {
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
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ClientController)
     */
    _config: {}
};