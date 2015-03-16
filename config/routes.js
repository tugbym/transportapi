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

  'get /api': 'InfoController.index',
  
  'get /api/client': 'ClientController.read',
  'get /api/client/:id': 'ClientController.read',
  'post /api/client': 'ClientController.create',
  'post /api/client/search': 'ClientController.search',
  'put /api/client/:id': 'ClientController.update',
  'delete /api/client/:id': 'ClientController.delete',
    
  'get /api/bus': 'BusController.read',
  'get /api/bus/:id': 'BusController.read',
  'post /api/bus': 'BusController.create',
  'post /api/bus/search': 'BusController.search',
  'put /api/bus/:id': 'BusController.update',
  'delete /api/bus/:id': 'BusController.delete',
    
  'get /api/flight': 'FlightController.read',
  'get /api/flight/:id': 'FlightController.read',
  'post /api/flight': 'FlightController.create',
  'post /api/flight/search': 'FlightController.search',
  'put /api/flight/:id': 'FlightController.update',
  'delete /api/flight/:id': 'FlightController.delete',
    
  'get /api/train': 'TrainController.read',
  'get /api/train/:id': 'TrainController.read',
  'post /api/train': 'TrainController.create',
  'post /api/train/search': 'TrainController.search',
  'put /api/train/:id': 'TrainController.update',
  'delete /api/train/:id': 'TrainController.delete',
  
  'get /api/user/all': 'UserController.readAll',
  'get /api/user': 'UserController.read',
  'get /api/user/:id': 'UserController.read',
  'post /api/user': 'UserController.create',
  'post /api/user/search': 'UserController.search',
  'put /api/user/:id': 'UserController.updateOne',
  'put /api/user': 'UserController.update',
  'delete /api/user/:id': 'UserController.deleteOne',
  'delete /api/user': 'UserController.delete',
    
  'put /api/user/friends/:name': 'UserController.addFriend',
  'delete /api/user/friends/:name': 'UserController.removeFriend',
    
  'put /api/user/bus/:id': 'UserController.addBus',
  'delete /api/user/bus/:id': 'UserController.deleteBus',
  'put /api/user/train/:id': 'UserController.addTrain',
  'delete /api/user/train/:id': 'UserController.deleteTrain',
  'put /api/user/flight/:id': 'UserController.addFlight',
  'delete /api/user/flight/:id': 'UserController.deleteFlight',
  
  'post /api/login': 'AuthController.login',
  'get /api/logout': 'AuthController.logout'

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
