/**
 * ClientController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cj = require('../services/CjTemplate.js')('client', ['id', 'name', 'redirectURI', 'clientId', 'clientSecret', 'trusted']);
var passport = require('passport');

module.exports = {
    
    //Creating a client.
    create: function(req, res) {
        var base = 'http://' + req.headers.host;
        var name = req.body.name;
        var redirectURI = req.body.redirectURI;
        
        //See if the client name already exists.
        Client.findOne({
            name: name
        }).exec(function(err, client) {
            
            //No errors and no client found, so proceed with creation.
            if(!err && !client) {
                Client.create({
                    name: name,
                    redirectURI: redirectURI
                }).exec(function(err, client) {
                    
                    //Error creating a client.
                    if(err) {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                        
                    //No problems, so send a 201 response.
                    } else {
                        res.setHeader("Location", base + "/api/client/" + client.id);
                        res.status(201).json({
                            message: "Client created: " + client.id,
                            clientId: client.clientId,
                            clientSecret: client.clientSecret
                        });
                    }
                });
                
            //Client found.
            } else if(!err && client) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(409).json(cj.createCjError(base, "Client name already exists", 409));
                
            //Error searching for client.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Getting client information
    read: function(req, res) {
        var base = 'http://' + req.headers.host;
        
        //If there was an ID parameter, search for that. Else, search for all.
        var id = req.params.id;
        var query = {};
        if(id) {
            query = {
                id: id
            };
        }
        
        //Search the client model.
        Client.find(query, function(err, clients) {
            
            //Error searching for client.
            if(err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
                
            //No client(s) found.
            } else if(!clients[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Client(s) not found.", 404));
                
            //Clients found.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, clients));
            }
        });
    },
    
    //ADMIN ONLY - Updating client information.
    update: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.id;
        var newDoc = {};
        
        //See if the request is valid.
        var acceptedEditInputs = ['redirectURI', 'trusted'];
        for(var request in req.body) {
            
            //Invalid request.
            if(acceptedEditInputs.indexOf(request) === -1) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(400).json(cj.createCjError(base, "You may only edit the redirectURI and trusted values.", 400));
            }
            
            //Valid request.
            newDoc[request] = req.body[request];
        }
        
        //Update the client model.
        Client.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            
            //No problems.
            if(!err && updatedDoc[0]) {
                res.setHeader("Location", base + "/api/client/" + updatedDoc[0].id);
                res.status(200).json({
                    message: "Client updated: " + updatedDoc[0].id
                });
                
            //No client found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Client not found.", 404));
                
            //Error updating client.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Deleting clients.
    delete: function(req, res) {
        var base = 'http://' + req.headers.host;
        var id = req.params.id;
        
        //See if the client ID is valid first.
        Client.findOne({
            id: id
        }, function(err, doc) {
            
            //Client ID is valid, so proceed with deletion.
            if(!err && doc) {
                Client.destroy({id: id}).exec(function(err) {
                    
                    //No problems.
                    if(!err) {
                        res.status(200).json({
                            message: "Client successfully removed."
                        });
                        
                    //Error deleting the client.
                    } else {
                        res.setHeader("Content-Type", "application/vnd.collection+json");
                        res.status(500).json(cj.createCjError(base, err, 500));
                    }
                });
                
            //No client found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Could not find client.", 404));
                
            //Error searching for client.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    },
    
    //ADMIN ONLY - Searching for clients.
    search: function(req, res) {
        var base = 'http://' + req.headers.host;
        var criteria = req.body.search;
        var searchBy = req.body.searchBy;
        
        //See if the request is valid - if not, stop request.
        var acceptedSearchByInputs = ['id', 'clientId', 'clientSecret', 'name', 'redirectURI', 'trusted'];
        if(acceptedSearchByInputs.indexOf(searchBy) === -1) {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            return res.status(400).json(cj.createCjError(base, "Search By value not permitted.", 400));
        }
        
        //Request is valid.
        var search = {};
        search[searchBy] = criteria;
        
        //Search for clients.
        Client.find().where(search).limit(20).exec(function(err, results) {
            
            //Client(s) found.
            if(!err && results[0]) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(cj.createCjTemplate(base, results));
                
            //No client(s) found.
            } else if(!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "No search results found.", 404));
                
            //Error searching for clients.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
            }
        });
    }
};