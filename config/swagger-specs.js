  /****************************************************************************
  *                                                                           *
  * Bus Specifications                                                        *
  *                                                                           *
  ****************************************************************************/

// Find all buses
exports.findAllBuses = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus',
        'notes': 'Returns a collection of buses',
        'summary': 'Get all buses',
        'method': 'GET',
        'type': 'Bus',
        'responseMessages': [{
            "code": 200,
            "message": "Collection of buses returned"
        }, {
            "code": 404,
            "message": "No buses found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getAllBuses',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

// Find one bus
exports.findOneBus = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus/{busID}',
        'notes': 'Returns a bus based on ID',
        'summary': 'Get one bus',
        'method': 'GET',
        'parameters' : [{
            'name': 'busID',
            'description': 'ID of Bus to find',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'type': 'Bus',
        'responseMessages': [{
            "code": 200,
            "message": "Bus with specified Bus ID returned"
        }, {
            "code": 404,
            "message": "No bus with that Bus ID found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getOneBus',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

//Add a bus
exports.addBus = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus',
        'notes': 'Adds a new bus with a randomly generated ID with an OAuth2 Access Token',
        'summary': 'Add one bus using an Access Token',
        'method': 'POST',
        'type': 'Bus',
        'responseMessages': [{
            "code": 201,
            "message": "New Bus successfully created"
        }, {
            "code": 401,
            "message": "Not authorized to create a new Bus"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'postBus',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Edit a bus
exports.editBus = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus/{busID}',
        'notes': 'Edit a bus using its ID with an OAuth2 Access Token',
        'summary': 'Edit one bus using an Access Token',
        'method': 'PUT',
        'type': 'Bus',
        'parameters' : [{
            'name': 'busID',
            'description': 'ID of Bus to edit',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Bus successfully updated"
        }, {
            "code": 401,
            "message": "Not authorized to create a new Bus"
        }, {
            "code": 404,
            "message": "Bus not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'putBus',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Delete a bus
exports.deleteBus = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus/{busID}',
        'notes': 'Delete a bus using its ID with an OAuth2 Access Token',
        'summary': 'Delete one bus using an Access Token',
        'method': 'DELETE',
        'type': 'Bus',
        'parameters' : [{
            'name': 'busID',
            'description': 'ID of Bus to delete',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Bus successfully deleted"
        }, {
            "code": 401,
            "message": "Not authorized to create a new Bus"
        }, {
            "code": 404,
            "message": "Bus not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'deleteBus',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * User Specifications                                                       *
  *                                                                           *
  ****************************************************************************/

//Get the currently logged in user
exports.findCurrentUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user',
        'notes': 'Returns the currently logged in user',
        'summary': 'Get the current user',
        'method': 'GET',
        'type': 'User',
        'responseMessages': [{
            'code': 200,
            'message': 'Current users profile returned'
        }, {
            'code': 403,
            'message': 'No user authenticated'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'getCurrentUser',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

//Get user by ID
exports.findOneUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user/{userID}',
        'notes': 'Returns a user based on ID',
        'summary': 'Get one user',
        'method': 'GET',
        'parameters' : [{
            'name': 'userID',
            'description': 'ID of User to find',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'type': 'User',
        'responseMessages': [{
            'code': 200,
            'message': 'Users profile returned'
        }, {
            'code': 404,
            'message': 'User with that ID could not be found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'getOneUser',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

//Add a user
exports.addUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user',
        'notes': 'Adds a new user with a randomly generated ID',
        'summary': 'Add one user',
        'method': 'POST',
        'type': 'User',
        'responseMessages': [{
            'code': 201,
            'message': 'New User successfully created'
        }, {
            'code': 403,
            'message': 'User with that name already exists'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'postUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Login a user
exports.login = {
    'spec': {
        'description': 'User authentication operations',
        'path': '/login',
        'notes': 'Creates a new session for a user',
        'summary': 'Login a User',
        'method': 'POST',
        'parameters': [{
            'name': 'username',
            'description': 'The username of the user',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'password',
            'description': 'The password of the user',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User successfully logged in'
        }, {
            'code': 401,
            'message': 'Invalid Login credentials'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'loginUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Logout a user
exports.logout = {
    'spec': {
        'description': 'User authentication operations',
        'path': '/logout',
        'notes': 'Deletes the session of the currently logged in user',
        'summary': 'Logout a User',
        'method': 'GET',
        'responseMessages': [{
            'code': 200,
            'message': 'User successfully logged out'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'logoutUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * OAuth2 Specifications                                                     *
  *                                                                           *
  ****************************************************************************/

//Link up a client with a user
exports.authorize = {
    'spec': {
        'description': 'OAuth2 operations',
        'path': '/oauth/authorize',
        'notes': 'Links up a client with a user',
        'summary': 'Link a user to a client',
        'method': 'GET',
        'parameters': [{
            'name': 'client_id',
            'description': 'The clients client ID',
            'type': 'string',
            'required': true,
            'paramType': 'query'
        }, {
            'name': 'client_secret',
            'description': 'The clients client secret',
            'type': 'string',
            'required': true,
            'paramType': 'query'
        }, {
            'name': 'response_type',
            'description': 'The server response type',
            'type': 'string',
            'required': true,
            'paramType': 'query',
            'defaultValue': 'code'
        }, {
            'name': 'redirect_uri',
            'description': 'The clients redirect URI',
            'type': 'string',
            'required': true,
            'paramType': 'query',
            'defaultValue': 'success'
        }, {
            'name': 'scope',
            'description': 'The servers URL',
            'type': 'string',
            'required': true,
            'paramType': 'query',
            'defaultValue': 'http://fiesta-collect.codio.io:3000'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Transaction ID granted'
        }, {
            'code': 400,
            'message': 'Request parameters not valid'
        }, {
            'code': 401,
            'message': 'User not logged in'
        }, {
            'code': 403,
            'message': 'Invalid client credentials'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }, {
            'code': 501,
            'message': 'Invalid response type'
        }],
        'nickname': 'authorizeClient',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Send a request to use the API
exports.authorizationRequest = {
    'spec': {
        'description': 'OAuth2 operations',
        'path': '/oauth/authorize/decision',
        'notes': 'Uses a transaction ID to send a request to the server admin asking permission for access to the Bus, Flight and Train routes',
        'summary': 'Send an authorization request with a Transaction ID',
        'method': 'POST',
        'parameters': [{
            'name': 'transaction_id',
            'description': 'The transaction ID generated from linking up a client with a user',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Authorization request successfully sent, and user sent to redirect URI'
        }, {
            'code': 401,
            'message': 'User not logged in'
        }, {
            'code': 403,
            'message': 'Invalid transaction'
        }, {
            'code': 404,
            'message': 'Authorization request successfully sent, but redirect URI is not a configured route in the application'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'sendRequest',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Request an Access Token
exports.accessTokenAuthExchange = {
    'spec': {
        'description': 'OAuth2 operations',
        'path': '/oauth/token',
        'notes': 'Uses an authorization code to grant a trusted client an access token and a refresh token for access to the Bus, Flight and Train routes',
        'summary': 'Request an Access Token with an Authorization Code',
        'method': 'POST',
        'parameters': [{
            'name': 'client_id',
            'description': 'The clients client ID',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'client_secret',
            'description': 'The clients client secret',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'grant_type',
            'description': 'The servers grant type',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'authorization_code'
        }, {
            'name': 'redirect_uri',
            'description': 'The clients redirect URI',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'success'
        }, {
            'name': 'code',
            'description': 'The authorization code generated from sending an authorization request',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Access Token and Refresh Token granted'
        }, {
            'code': 401,
            'message': 'User not logged in'
        }, {
            'code': 403,
            'message': 'Invalid credentials'
        }, {
            'code': 404,
            'message': 'Client does not exist'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }, {
            'code': 501,
            'message': 'Invalid grant type'
        }],
        'nickname': 'getAccessTokenwithAuthCode',
        'produces': ['application/json']
    },
    'action': function(req, res) {
        
    }
}

exports.accessTokenPasswordExchange = {
    'spec': {
        'description': 'OAuth2 operations',
        'path': '/oauth/token',
        'notes': 'Exchange user and client credentials to grant a trusted client an Access Token for access to the Bus, Flight and Train routes',
        'summary': 'Request an Access Token with Username and Password',
        'method': 'POST',
        'parameters': [{
            'name': 'client_id',
            'description': 'The clients client ID',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'client_secret',
            'description': 'The clients client secret',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'grant_type',
            'description': 'The servers grant type',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'password'
        }, {
            'name': 'username',
            'description': 'The users username',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'password',
            'description': 'The users password',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Access Token and Refresh Token granted'
        }, {
            'code': 401,
            'message': 'User not logged in'
        }, {
            'code': 403,
            'message': 'Invalid credentials'
        }, {
            'code': 404,
            'message': 'Client does not exist'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }, {
            'code': 501,
            'message': 'Invalid grant type'
        }],
        'nickname': 'getAccessTokenwithPassword',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

exports.accessTokenRefreshExchange = {
    'spec': {
        'description': 'OAuth2 operations',
        'path': '/oauth/token',
        'notes': 'Exchange a refresh token to grant a new Access Token for access to the Bus, Flight and Train routes',
        'summary': 'Request an Access Token with a Refresh Token',
        'method': 'POST',
        'parameters': [{
            'name': 'client_id',
            'description': 'The clients client ID',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'client_secret',
            'description': 'The clients client secret',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'grant_type',
            'description': 'The servers grant type',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'refresh_token'
        }, {
            'name': 'refresh_token',
            'description': 'The clients refresh token',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'New Access Token and New Refresh Token granted'
        }, {
            'code': 401,
            'message': 'User not logged in'
        }, {
            'code': 403,
            'message': 'Invalid credentials'
        }, {
            'code': 404,
            'message': 'Client does not exist'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }, {
            'code': 501,
            'message': 'Invalid grant type'
        }],
        'nickname': 'getAccessTokenwithRefresh',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}