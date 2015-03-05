/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'index' },
  '/api': { view: 'api' },
  '/api/info': 'InfoController.index',
  
  'get /client': 'ClientController.view',
  'post /client': 'ClientController.create',
  'put /client/:id': 'ClientController.update',
  'delete /client/:id': 'ClientController.delete',
    
  'get /bus': 'BusController.read',
  'post /bus': 'BusController.create',
  'put /bus/:id': 'BusController.update',
  'delete /bus/:id': 'BusController.delete',
    
  'get /busStop': 'BusStopController.read',
  'post /busStop': 'BusStopController.create',
  'put /busStop/:id': 'BusStopController.update',
  'delete /busStop/:id': 'BusStopController.delete',
    
  'get /flight': 'FlightController.read',
  'post /flight': 'FlightController.create',
  'put /flight/:id': 'FlightController.update',
  'delete /flight/:id': 'FlightController.delete',
    
  'get /train': 'TrainController.read',
  'post /train': 'TrainController.create',
  'put /train/:id': 'TrainController.update',
  'delete /train/:id': 'TrainController.delete',
    
  'get /user': 'UserController.read',
  'post /user': 'UserController.create',
  'put /user': 'UserController.update',
  'delete /user': 'UserController.delete',
    
  'put /user/friends/:name': 'UserController.addFriend',
  'delete /user/friends/:name': 'UserController.removeFriend',
  
  'get /login': { view: 'login' },
  'post /login': 'AuthController.login',
  'get /logout': 'AuthController.logout'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
