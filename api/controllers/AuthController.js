/**
 * AuthController
 *
 * @description :: Server-side logic for managing user authentication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {
    
    //A check to see if a user is logged in.
    loggedInCheck: function(req, res) {
        var base = 'http://' + req.headers.host;
        var cj = require('../services/CjTemplate.js') ('login');
        
        //A user is logged in.
        if (req.user) {
            res.setHeader("Location", base + "/api/user/" + req.user.id);
            res.status(200).json({message: req.user.nickname + " is currently logged in."});
            
        //No user logged in.
        } else {
            res.setHeader("Content-Type", "application/vnd.collection+json");
            res.status(401).json(cj.createCjError(base, "No user logged in.", 401));
        }
    },
    
    //Login a user with Passport's local strategy.
    login: function(req, res) {
        var base = 'http://' + req.headers.host;
        var cj = require('../services/CjTemplate.js') ('login');
        passport.authenticate('local', function(err, user, info) {
            
            //No user found.
            if (!err && !user) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(404).json(cj.createCjError(base, "Invalid Login", 404));
                return;
            }
            
            //Error returned.
            else if (err) {
                res.setHeader("Content-Type", "application/vnd.collection+json");
                res.status(500).json(cj.createCjError(base, err, 500));
                return;
            }
            
            //No problems - so set session state.
            req.logIn(user, function(err) {
                
                //Error returned.
                if(err) {
                    res.setHeader("Content-Type", "application/vnd.collection+json");
                    res.status(500).json(cj.createCjError(base, err, 500));
                    return;
                }
                
                //No problems - let the user know they are now logged in.
                res.setHeader("Location", base + "/api/user/" + req.user.id);
                res.status(200).json({message: "User logged in successfully"});
                return;
            });
        })(req, res);
    },
    
    //Log the user out
    logout: function(req, res) {
        var base = 'http://' + req.headers.host;
        var cj = require('../services/CjTemplate.js') ('logout');
        
        //Remove the user session object - and let the user know.
        req.logout();
        res.status(200).json({message: "User logged out successfully"});
    }
};