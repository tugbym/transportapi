/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow admin authentication
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {
    var path = req.route.path.split('/api/').pop();
    var cj = require('../services/CjTemplate.js')(path);
    var base = 'http://' + req.headers.host;

    if(req.user) {
        
        //Search the user model for the admin user.
        Users.findOne({nickname: 'admin'}, function(err, doc) {
            if(!err && doc) {
                
                //If admin ID is equal to the logged in users ID from the session object, let the admin access.
                if (req.user.id == doc.id) {
                    return next();
                
                //A non admin user must be logged in.
                } else {
                    res.setHeader("Content-Type", "application/vnd.collection+json");
                    return res.status(401).json(cj.createCjError(base, "You must be logged in as an admin to access this route.", 401));
                }
                
            //No admin found.
            } else if (!err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(404).json(cj.createCjError(base, "Admin does not exist.", 404));
            
            //Error searching for admin.
            } else {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                return res.status(500).json(cj.createCjError(base, err, 500))
            }
        });
        
    //No user logged in.
    } else {
        res.setHeader("Content-Type", "application/vnd.collection+json");
        return res.status(401).json(cj.createCjError(base, "You must be logged in as an admin to access this route.", 401));
    }
};