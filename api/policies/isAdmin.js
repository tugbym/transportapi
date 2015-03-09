/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var cj = require('../services/CjTemplate.js')('client');

module.exports = function(req, res, next) {
    var base = 'http://' + req.headers.host;

    if(req.user) {
        Users.findOne({nickname: 'admin'}, function(err, doc) {
            if(!err && doc) {
                if (req.user.id == doc.id) {
                    return next();
                } else {
                    return res.status(403).json(cj.createCjError(base, "You must be logged in as an admin to access this route.", 403));
                }
            } else if (!err) {
                return res.status(404).json(cj.createCjError(base, "Admin does not exist.", 404));
            } else {
                return res.status(500).json(cj.createCjError(base, err, 500))
            }
        });
    } else {
        return res.status(403).json(cj.createCjError(base, "You must be logged in as an admin to access this route.", 403));
    }
};