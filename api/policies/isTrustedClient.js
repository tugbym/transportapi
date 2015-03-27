/**
 * isTrustedClient policy
 *
 * @module      :: Policy
 * @description :: Simple policy to check for trusted clients
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {
    var path = req.route.path.split('/api/').pop();
    var base = 'http://' + req.headers.host;
    var cj = require('../services/CjTemplate.js') (path);
    
    var grantType = req.param('grant_type');
    
    //Make sure there was a grant type.
    if(!grantType) {
        return res.status(400).json(cj.createCjError(base, 'Missing grant_type parameter', 400));
    } else {
        
        //Make sure there was a client ID.
        var clientId = req.param('client_id');
        if(!clientId) {
            return res.status(400).json(cj.createCjError(base, 'missing client_id parameter', 400));
        } else {
            
            //Make sure client is trusted
            Client.findOne({
                clientId: clientId
            }, function(err, client) {
                
                //Error searching for client.
                if(err) {
                    return res.status(500).json(cj.createCjError(base, err, 500));
                } else {
                    
                    //Client not found.
                    if(!client) {
                        return res.status(404).json(cj.createCjError(base, 'Client does not exist.', 404));
                        
                    //If client is trusted - grant them access.
                    } else if(client.trusted) {
                        return next();
                        
                    //Client is not trusted - revoke access.
                    } else {
                        return res.status(403).json(cj.createCjError(base, 'Your client has not been validated.', 403));
                    }
                }
            });
        }
    }
};