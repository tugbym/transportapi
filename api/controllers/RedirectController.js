/**
 * RedirectController
 *
 * @description :: Server-side logic for managing OAuth2's Redirect URI
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    //Grab the authorization code from the redirect URI.
    getCode: function(req, res) {
        res.status(200).json({'message': 'Authorization Code granted', 'auth_code': req.query.code, 'note': 'A server admin is currently reviewing your application. If accepted, this code will grant you access.'});
    }
};