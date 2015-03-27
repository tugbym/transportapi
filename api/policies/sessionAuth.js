/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
    var path = req.route.path.split('/api/').pop();
    var base = 'http://' + req.headers.host;
    var cj = require('../services/CjTemplate.js') (path);
    
    //If user session object, allow access.
    if(req.user) {
        return next();
    }
    return res.status(401).json(cj.createCjError(base, "Not authenticated.", 401));
};