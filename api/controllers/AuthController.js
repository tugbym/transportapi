/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling auth requests.
 */

var passport = require('passport');

module.exports = {
    login: function(req, res) {
        var base = 'http://' + req.headers.host;
        var cj = require('../services/CjTemplate.js') ('login');
        passport.authenticate('local', function(err, user, info) {
            if (!err && !user) {
                res.status(403).json(cj.createCjError(base, "Invalid Login", 403));
                return;
            }
            else if (err) {
                res.status(500).json(cj.createCjError(base, err, 500));
                return;
            }
            // use passport to log in the user using a local method
            req.logIn(user, function(err) {
                if(err) {
                    console.log("Error: " + err);
                    res.status(500).json(cj.createCjError(base, err, 500));
                    return;
                }
                res.status(200).json({message: "User logged in successfully", user: req.user});
                return;
            });
        })(req, res);
    },
    logout: function(req, res) {
        var base = 'http://' + req.headers.host;
        var cj = require('../services/CjTemplate.js') ('logout');
        req.logout();
        res.status(200).json({message: "User logged out successfully"});
    }
};