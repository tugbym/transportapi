/**
 * oauthBearer policy
 *
 * @module      :: Policy
 * @description :: Simple policy to allow oauth2 authentication
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var passport = require('passport');
module.exports = function(req, res, next) {
    var path = req.route.path.split('/api/').pop();
    var base = 'http://' + req.headers.host;
    var cj = require('../services/CjTemplate.js')(path);
    
    //Authenticate the user with passport's bearer strategy.
    passport.authenticate('bearer', function(err, user, info) {
        
        switch(info.scope) {
                
            //If Write:Bus scope and URL is not a bus route.
            case 'write:bus':
                if(req.url.indexOf('bus') === -1) {
                    return res.status(403).json(cj.createCjError(base, "You are not authorized to access this.", 403));
                }
                break;
                
            //If Write:Train scope and URL is not a train route.
            case 'write:train':
                if(req.url.indexOf('train') === -1) {
                    return res.status(403).json(cj.createCjError(base, "You are not authorized to access this.", 403));
                }
                break;
                
            //If Write:Flight scope and URL is not a flight route.
            case 'write:flight':
                if(req.url.indexOf('flight') === -1) {
                    return res.status(403).json(cj.createCjError(base, "You are not authorized to access this.", 403));
                }
                break;
                
            //Any other
            default:
                return res.status(403).json(cj.createCjError(base, "You are not authorized to access this.", 403));
        }
        
        //If any error, or no user found.
        if((err) || (!user)) {
            return res.status(403).json(cj.createCjError(base, "You are not authorized to access this.", 403));
        }
        delete req.query.access_token;
        req.user = user;
        return next();
    })(req, res);
};