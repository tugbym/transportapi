/**
 * oauthBearer policy
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var passport = require('passport');
module.exports = function(req, res, next) {
    passport.authenticate('bearer', function(err, user, info) {
        switch(info.scope) {
                
            case 'write:bus':
                if(req.url.indexOf('bus') == -1) {
                    return res.status(401).json({
                        message: "Not authorized."
                    });
                }
                break;
                
            case 'write:train':
                if(req.url.indexOf('train') == -1) {
                    return res.status(401).json({
                        message: "Not authorized."
                    });
                }
                break;
                
            case 'write:flight':
                if(req.url.indexOf('flight') == -1) {
                    return res.status(401).json({
                        message: "Not authorized."
                    });
                }
                break;
                
            default:
                return res.status(401).json({
                    message: "Not authorized."
                });
                
        }
        if((err) || (!user)) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }
        delete req.query.access_token;
        req.user = user;
        return next();
    })(req, res);
};