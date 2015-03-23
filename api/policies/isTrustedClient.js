/**
 * isTrustedClient policy
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
    var grantType = req.param('grant_type');
    if(!grantType) {
        return res.send(400, 'missing grant_type parameter');
    } else {
        // Handle password and authorization code grant type
        // Make sure client_id is provided
        var clientId = req.param('client_id');
        if(!clientId) {
            return res.send(400, 'missing client_id parameter');
        } else {
            // Make sure client is trusted
            Client.findOne({
                clientId: clientId
            }, function(err, client) {
                if(err) {
                    return res.send(500, err.message);
                } else {
                    if(!client) {
                        return res.send(404, 'Client does not exist.');
                    } else if(client.trusted) {
                        return next();
                    } else {
                        return res.send(401, 'Your client has not been validated.');
                    }
                }
            });
        }
    }
};