var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    login = require('connect-ensure-login'),
    bcrypt = require('bcrypt'),
    mail = require('nodemailer'),
    trustedClientPolicy = require('../api/policies/isTrustedClient.js');
// Create OAuth 2.0 server
var server = oauth2orize.createServer();
server.serializeClient(function(client, done) {
    return done(null, client.id);
});
server.deserializeClient(function(id, done) {
    Client.findOne(id, function(err, client) {
        if(err) {
            return done(err);
        }
        return done(null, client);
    });
});
// Generate authorization code
server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    AuthCode.create({
        clientId: client.clientId,
        redirectURI: redirectURI,
        userId: user.id,
        scope: ares.scope
    }).exec(function(err, code) {
        if(err) {
            return done(err, null);
        }
        
        // Setup Mandrill to send mail
        var mandrillUser = process.env.MANDRILL_USERNAME;
        var mandrillPass = process.env.MANDRILL_PASSWORD;
        var transporter = mail.createTransport({
            service: 'Mandrill',
            auth: {
                user: mandrillUser,
                pass: mandrillPass
            }
        });
        
        // Alert the admin of the client request
        transporter.sendMail({
            from: mandrillUser,
            to: mandrillUser,
            subject: "New Client Application",
            html: "Client UID: <b>" + client.id + "</b><br>Client ID: <b>" + client.clientID + "</b><br>Client Secret: <b>" + client.clientSecret + "</b><br>Redirect URI: <b>" + redirectURI + "</b><br>Authorization Code: <b>" + code.code + "</b><br>User ID: <b>" + user.id + "</b><br>Username: <b>" + user.nickname + "</b><br>Email: <b>" + user.email + "</b>"
        }, function(err, response) {
            if(err) {
                console.log("Error sending email: " + err);
            } else {
                console.log("Email successfully sent!");
            }
        });
        
        // Alert the client that the application has been received
        transporter.sendMail({
            from: mandrillUser,
            to: user.email,
            subject: "Application Sent",
            html: "Hey, " + user.nickname + ". We just received your request and will review your application to use Project Hydra."
        }, function(err, response) {
            if (err) {
                console.log("Error sending email: " + err);
            } else {
                console.log("Email successfully sent!");
            }
        });
        
        return done(null, code.code);
    });
}));
// Generate access token for Implicit flow
// Only access token is generated in this flow, no refresh token is issued
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
    AccessToken.destroy({
        userId: user.id,
        clientId: client.clientId
    }, function(err) {
        if(err) {
            return done(err);
        } else {
            AccessToken.create({
                userId: user.id,
                clientId: client.clientId
            }, function(err, accessToken) {
                if(err) {
                    return done(err);
                } else {
                    return done(null, accessToken.token);
                }
            });
        }
    });
}));
// Exchange authorization code for access token
server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
    console.log(client);
    console.log(code);
    AuthCode.findOne({
        code: code
    }).exec(function(err, code) {
        if(err || !code) {
            return done(err);
        }
        if(client.clientId !== code.clientId) {
            return done(null, false);
        }
        if(redirectURI !== code.redirectURI) {
            return done(null, false);
        }
        // Remove Refresh and Access tokens and create new ones
        RefreshToken.destroy({
            userId: code.userId,
            clientId: code.clientId,
            scope: code.scope
        }, function(err) {
            if(err) {
                return done(err);
            } else {
                AccessToken.destroy({
                    userId: code.userId,
                    clientId: code.clientId,
                    scope: code.scope
                }, function(err) {
                    if(err) {
                        return done(err);
                    } else {
                        RefreshToken.create({
                            userId: code.userId,
                            clientId: code.clientId,
                            scope: code.scope
                        }, function(err, refreshToken) {
                            if(err) {
                                return done(err);
                            } else {
                                AccessToken.create({
                                    userId: code.userId,
                                    clientId: code.clientId,
                                    scope: code.scope
                                }, function(err, accessToken) {
                                    if(err) {
                                        return done(err);
                                    } else {
                                        return done(null, accessToken.token, refreshToken.token, {
                                            'expires_in': sails.config.oauth.tokenLife
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}));
// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    Users.findOne({
        nickname: username
    }, function(err, user) {
        if(err) {
            return done(err);
        }
        if(!user) {
            return done(null, false);
        }
        var pwdCompare = bcrypt.compareSync(password, user.password);
        if(!pwdCompare) {
            return done(null, false)
        };
        // Remove Refresh and Access tokens and create new ones
        RefreshToken.destroy({
            userId: user.id,
            clientId: client.clientId
        }, function(err) {
            if(err) {
                return done(err);
            } else {
                AccessToken.destroy({
                    userId: user.id,
                    clientId: client.clientId
                }, function(err) {
                    if(err) {
                        return done(err);
                    } else {
                        RefreshToken.create({
                            userId: user.id,
                            clientId: client.clientId,
                            scope: scope
                        }, function(err, refreshToken) {
                            if(err) {
                                return done(err);
                            } else {
                                AccessToken.create({
                                    userId: user.id,
                                    clientId: client.clientId,
                                    scope: scope
                                }, function(err, accessToken) {
                                    if(err) {
                                        return done(err);
                                    } else {
                                        done(null, accessToken.token, refreshToken.token, {
                                            'expires_in': sails.config.oauth.tokenLife
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}));
// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshToken.findOne({
        token: refreshToken
    }, function(err, token) {
        if(err) {
            return done(err);
        }
        if(!token) {
            return done(null, false);
        }
        if(!token) {
            return done(null, false);
        }
        Users.findOne({
            id: token.userId
        }, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false);
            }
            // Remove Refresh and Access tokens and create new ones 
            RefreshToken.destroy({
                userId: user.id,
                clientId: client.clientId
            }, function(err) {
                if(err) {
                    return done(err);
                } else {
                    AccessToken.destroy({
                        userId: user.id,
                        clientId: client.clientId
                    }, function(err) {
                        if(err) {
                            return done(err);
                        } else {
                            RefreshToken.create({
                                userId: user.id,
                                clientId: client.clientId,
                                scope: scope
                            }, function(err, refreshToken) {
                                if(err) {
                                    return done(err);
                                } else {
                                    AccessToken.create({
                                        userId: user.id,
                                        clientId: client.clientId,
                                        scope: scope
                                    }, function(err, accessToken) {
                                        if(err) {
                                            return done(err);
                                        } else {
                                            done(null, accessToken.token, refreshToken.token, {
                                                'expires_in': sails.config.oauth.tokenLife
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}));
module.exports = {
    http: {
        customMiddleware: function(app) {
            // Initialize passport
            app.use(passport.initialize());
            app.use(passport.session());
            /***** OAuth authorize endPoints *****/
            app.get('/api/oauth/authorize', login.ensureLoggedIn('/api/login'), server.authorize(function(clientId, redirectURI, done) {
                Client.findOne({
                    clientId: clientId
                }, function(err, client) {
                    if(err) {
                        return done(err);
                    }
                    if(!client) {
                        return done(null, false);
                    }
                    if(client.redirectURI != redirectURI) {
                        return done(null, false);
                    }
                    return done(null, client, client.redirectURI);
                });
            }), server.errorHandler(), function(req, res) {
                return res.json({
                    message: 'Successful link',
                    transactionID: req.oauth2.transactionID,
                    user: req.user,
                    client: req.oauth2.client
                });
            });
            app.post('/api/oauth/authorize/decision', login.ensureLoggedIn('/api/login'), server.decision(function(req, done) {
                return done(null, { scope: req.oauth2.req.scope })
            }));
            /***** OAuth token endPoint *****/
            app.post('/api/oauth/token', login.ensureLoggedIn('/api/login'), trustedClientPolicy, passport.authenticate(['oauth2-client-password'], {
                session: false
            }), server.token(), server.errorHandler());
        }
    }
};