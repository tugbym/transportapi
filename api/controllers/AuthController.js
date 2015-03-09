/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling auth requests.
 */

var passport = require('passport');

module.exports = {
    login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (!err && !user) {
                res.status(400).json({message: "Invalid Login"});
                return;
            }
            else if (err) {
                res.status(500).json({message: "Error: " + err});
                return;
            }
            // use passport to log in the user using a local method
            req.logIn(user, function(err) {
                if(err) {
                    console.log("Error: " + err);
                    res.status(500).json({message: "Error: " + err});
                    return;
                }
                res.status(200).json({message: "User logged in successfully", user: req.user});
                return;
            });
        })(req, res);
    },
    logout: function(req, res) {
        req.logout();
        res.status(200).json({message: "User logged out successfully"});
    }
};