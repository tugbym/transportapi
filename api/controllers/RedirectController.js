/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling auth requests.
 */

module.exports = {
    getCode: function(req, res) {
        res.status(200).json({'message': 'Authorization Code granted', 'auth_code': req.query.code, 'note': 'A server admin is currently reviewing your application. If accepted, this code will grant you access.'});
    }
};