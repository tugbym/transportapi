/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	InfoController: {
        'index': 'oauthBearer'
	},
    BusController: {
        'create': 'oauthBearer',
        'update': 'oauthBearer',
        'delete': 'oauthBearer',
        'search': 'oauthBearer'
    },
    TrainController: {
        'create': 'oauthBearer',
        'update': 'oauthBearer',
        'delete': 'oauthBearer',
        'search': 'oauthBearer'
    },
    FlightController: {
        'create': 'oauthBearer',
        'update': 'oauthBearer',
        'delete': 'oauthBearer',
        'search': 'oauthBearer'
    },
    UserController: {
        'read': 'sessionAuth',
        'update': 'sessionAuth',
        'delete': 'sessionAuth',
        'addFriend': 'sessionAuth',
        'removeFriend': 'sessionAuth',
        'search': 'sessionAuth',
        'addBus': 'sessionAuth',
        'deleteBus': 'sessionAuth',
        'addTrain': 'sessionAuth',
        'deleteTrain': 'sessionAuth',
        'addFlight': 'sessionAuth',
        'deleteFlight': 'sessionAuth'
    }
};
