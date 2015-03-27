/**
 * clientAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated client
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
    var base = 'http://' + req.headers.host;
    var path = req.route.path.split('/api/').pop();
    var cj = require('../services/CjTemplate.js') (path);
    
    //If client ID is found in user session object, let them through.
    if(req.user) {
        if(req.user.clientId) {
            return next();
        }
    }
    return res.status(401).json(cj.createCjError(base, "No client authenticated", 401));
};