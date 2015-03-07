/**
 * BusstopController
 *
 * @description :: Server-side logic for managing busstops
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    read: function(req, res) {
        BusStop.find().exec(function(err, docs) {
            if(!err) {
                BusStop.subscribe(req.socket, docs);
                BusStop.watch(req);
                console.log("New subscribed user: " + sails.sockets.id(req));
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
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        BusStop.create({
            latitude: latitude,
            longitude: longitude
        }).exec(function(err, busStop) {
            if(!err) {
                res.status(201).json({
                    message: "New Bus Stop created: " + busStop
                });
                BusStop.publishCreate({
                    id: busStop.id,
                    latitude: busStop.latitude,
                    longitude: busStop.longitude
                }); 
            } else {
                res.status(500).json({
                    message: "Could not create bus stop. Error: " + err
                });
            }
        });
    },
    update: function(req, res) {
        var id = req.params.id;
        var newDoc = {};
        for(request in req.body) {
            newDoc[request] = req.body[request]
        }
        Bus.update({
            id: id
        }, newDoc).exec(function(err, updatedDoc) {
            if(!err) {
                res.status(200).json({
                    message: "Bus Stop updated: " + updatedDoc[0]
                });
            } else {
                res.status(500).json({
                    message: "Could not update bus stop: " + err
                });
            }
        });
    },
    delete: function(req, res) {
        var id = req.params.id;
        BusStop.findOne({
            id: id
        }, function(err, doc) {
            if(!err && doc) {
                BusStop.destroy(doc).exec(function(err) {
                    if(!err) {
                        res.status(200).json({
                            message: "Bus Stop successfully removed."
                        });
                    } else {
                        res.status(403).json({
                            message: "Could not delete bus stop: " + err
                        });
                    }
                })
            } else if(!err) {
                res.status(404).json({
                    message: "Could not find bus stop."
                });
            } else {
                res.status(403).json({
                    message: "Could not delete bus stop: " + err
                });
            }
        });
    }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/bus';
    cj.collection.links = [];
    cj.collection.links.push({
        'rel': 'home',
        'href': base
    });
    cj.collection.items = [];
    if(docs.length) {
        renderTransports(cj, base, docs);
    } else {
        renderTransport(cj, base, docs);
    }
    cj.collection.items.links = [];
    cj.collection.queries = [];
    cj.collection.template = {};
    return cj;
}

function renderTransports(cj, base, docs) {
    for(var i = 0; i < docs.length; i++) {
        item = {};
        item.href = base + '/bus/' + docs[i].id;
        item.data = [];
        item.links = [];
        var p = 0;
        var values = ['latitude', 'longitude'];
        for(var d in docs[i]) {
            if(values.indexOf(d) != -1) {
                item.data[p++] = {
                    'name': d,
                    'value': docs[i][d],
                    'prompt': d
                };
            }
        }
        cj.collection.items.push(item);
    }
}

function renderTransport(cj, base, docs) {
    item = {};
    item.href = base + '/bus/' + docs.id;
    item.data = [];
    item.links = [];
    var p = 0;
    var values = ['latitude', 'longitude'];
    for(var d in docs) {
        if(values.indexOf(d) != -1) {
            item.data[p++] = {
                'name': d,
                'value': docs[d],
                'prompt': d
            };
        }
    }
    cj.collection.items.push(item);
}