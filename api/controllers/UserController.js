/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  read: function (req, res) {
      if (req.session.user) {
        Users.find().exec(function(err, docs) {
            if(!err) {
                var base = 'http://' + req.headers.host;
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(200).json(createCjTemplate(base, docs));
            } else {
                res.status(500).json({message: err});
            }
        });
      } else {
          res.status(400).json({message: "Not authorized."});
      }
  },
  create: function (req, res) {
    var name = req.body.body;
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
        if (!err && !doc) {
            Users.create({
                name: name,
                nickname: nickname,
                photo: photo,
                email: email,
                bday: new Date(bday),
                password: password
            })
                .exec(function(err, user) {
                if (!err) {
                    res.status(201).json({
                        message: "New User created: " + user.nickname
                    });
                    
                } else {
                    res.status(500).json({
                        message: "Could not create user. Error: " + err
                    });
                }
            });
        } else if (!err) {
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
  update: function (req, res) {
      if (req.session.user) {
          
          var id = req.params.id;
          var newDoc = {};
          for (request in req.body) {
              newDoc[request] = req.body[request]
          }
          Users.update({id: id}, newDoc)
          .exec(function(err, updatedDoc) {
              if (!err) {
                  res.status(200).json({message: "User updated: " + updatedDoc[0].nickname});
              } else {
                  res.status(500).json({message: "Could not update user: " + err});
              }
          });
      } else {
          res.status(400).json({message: "Not authorized."});
      }
  },
  delete: function (req, res) {
    if (req.session.user) {
        var id = req.params.id;
      
        Users.findOne({id: id}, function(err, doc) {
            if (!err && doc) {
                Users.destroy(doc)
                .exec(function(err) {
                    if (!err) {
                        res.status(200).json({message: "User successfully removed."});
                    } else {
                        res.status(403).json({message: "Could not delete user: " + err});
                    }
                })
            } else if (!err) {
                res.status(404).json({message: "Could not find user."});
            } else {
                res.status(403).json({message: "Could not delete user: " + err});
            }
        });
    } else {
        res.status(400).json({message: "Not authorized."});
    }
  }
};

function createCjTemplate(base, docs) {
    var cj = {};
    cj.collection = {};
    cj.collection.version = "1.0";
    cj.collection.href = base + '/users';

    cj.collection.links = [];
    cj.collection.links.push({'rel':'home', 'href' : base});

    cj.collection.items = [];
    
    if (docs.length) {
        renderUsers(cj, base, docs);
    } else {
        renderUser(cj, base, docs);
    }
    
    cj.collection.items.links = [];
    
    cj.collection.queries = [];
    cj.collection.template = {};
    return cj;
}

function renderUsers(cj, base, docs) {

    for(var i=0;i<docs.length;i++) {
        item = {};
        item.href = base + '/users/' + docs[i].id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['name', 'nickname', 'photo', 'email', 'bday'];
        
        for (var d in docs[i]) {
            if (values.indexOf(d) != -1) {
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

function renderUser(cj, base, docs) {

        item = {};
        item.href = base + '/users/' + docs.id;
        item.data = [];
        item.links = [];
        
        var p = 0;
        var values = ['name', 'nickname', 'photo', 'email', 'bday'];
        
        for (var d in docs) {
            if (values.indexOf(d) != -1) {
                item.data[p++] = {
                    'name': d, 
                    'value': docs[d], 
                    'prompt': d
                };
            }
        }
        
        cj.collection.items.push(item);
}