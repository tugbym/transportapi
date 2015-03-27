/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

   order: [
       'startRequestTimer',
       'cookieParser',
       'session',
       'bodyParser',
       'handleBodyParserError',
       'swagger',
       'compress',
       'methodOverride',
       'poweredBy',
       '$custom',
       'router',
       'www',
       'favicon',
       '404',
       '500'
   ],

  /****************************************************************************
  *                                                                           *
  * Configuring Swagger middleware                                            *
  *                                                                           *
  ****************************************************************************/

    swagger: function(req, res, done) {
        var app = req.app;
        var swagger = require('swagger-node-express').createNew(app);
        
        // Initialize swagger
        swagger.constructor(app);
        
        //Import models and specs
        var models = require('./swagger-models.js');
        var specs = require('./swagger-specs.js');
        
        // Add models
        swagger.addModels(models)
        
            // Add user specs
            .addGet(specs.findCurrentUser)
            .addGet(specs.findOneUser)
            .addGet(specs.findAllUsers)
            .addGet(specs.logout)
            .addGet(specs.loggedInCheck)
            .addPost(specs.addUser)
            .addPost(specs.login)
            .addPost(specs.userSearch)
            .addPut(specs.editCurrentUser)
            .addPut(specs.addFriend)
            .addPut(specs.addToBus)
            .addPut(specs.addToTrain)
            .addPut(specs.addToFlight)
            .addPut(specs.editOneUser)
            .addDelete(specs.deleteCurrentUser)
            .addDelete(specs.deleteFriend)
            .addDelete(specs.deleteFromBus)
            .addDelete(specs.deleteFromTrain)
            .addDelete(specs.deleteFromFlight)
            .addDelete(specs.deleteOneUser)
        
            // Add client specs
            .addGet(specs.findAllClients)
            .addGet(specs.findOneClient)
            .addPost(specs.addClient)
            .addPost(specs.clientSearch)
            .addPut(specs.editClient)
            .addDelete(specs.deleteClient)
        
            // Add Oauth2 specs
            .addGet(specs.authorize)
            .addPost(specs.authorizationRequest)
            .addPost(specs.accessTokenAuthExchange)
            .addPost(specs.accessTokenPasswordExchange)
            .addPost(specs.accessTokenRefreshExchange)
        
            // Add bus specs
            .addGet(specs.findAllBuses)
            .addGet(specs.findOneBus)
            .addPost(specs.busSearch)
            .addPost(specs.addBus)
            .addPut(specs.editBus)
            .addDelete(specs.deleteBus)
        
            // Add train specs
            .addGet(specs.findAllTrains)
            .addGet(specs.findOneTrain)
            .addPost(specs.trainSearch)
            .addPost(specs.addTrain)
            .addPut(specs.editTrain)
            .addDelete(specs.deleteTrain)
        
            // Add flight specs
            .addGet(specs.findAllFlights)
            .addGet(specs.findOneFlight)
            .addPost(specs.flightSearch)
            .addPost(specs.addFlight)
            .addPut(specs.editFlight)
            .addDelete(specs.deleteFlight)
        
        swagger.setApiInfo({
            "title": "Project Hydra API",
            "description": "An open-source all-for-one social media transport API"
        });
        
        // Link it up
        swagger.configure('http://project-hydra-44013.onmodulus.net/api', '0.1');
        return done();
    }

  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

  }

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  //cache: 31557600000
};
