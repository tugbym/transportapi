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
            if((err) || (!user)) {
                console.log("Error: " + err);
                res.redirect('/login');
                return;
            }
            // use passport to log in the user using a local method
            req.logIn(user, function(err) {
                if(err) {
                    console.log("Error: " + err);
                    if(req.session.user) {
                        req.session.user = null;
                    }
                    res.redirect('/login');
                    return;
                }
                req.session.user = user.id;
                res.redirect('/');
                return;
            });
        })(req, res);
    },
    logout: function(req, res) {
        req.session.user = null;
        req.logout();
        res.redirect('/');
    }
};