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
        'notes': 'Adds a new bus with a randomly generated ID using an OAuth2 Access Token',
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
        'notes': 'Edit a bus with its ID using an OAuth2 Access Token',
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
            "message": "Not authorized to edit a Bus"
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
        'notes': 'Delete a bus with its ID using an OAuth2 Access Token',
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
            "message": "Not authorized to delete a Bus"
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

//Search for a Bus
exports.busSearch = {
    'spec': {
        'description': 'Bus operations',
        'path': '/bus/search',
        'notes': 'Search for a Bus based on an attribute',
        'summary': 'Search for a Bus',
        'method': 'POST',
        'type': 'Bus',
        'parameters': [{
            'name': 'search',
            'description': 'The search criteria',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'searchBy',
            'description': 'The attribute to search by',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'enum': ['id', 'arrivalBusStop', 'arrivalTime', 'busName', 'busNumber', 'departureBusStop', 'departureTime', 'latitude', 'longitude']
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Search Results returned'
        }, {
            'code': 403,
            'message': 'Search By value not permitted'
        }, {
            'code': 404,
            'message': 'No results found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'busSearch',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * Train Specifications                                                      *
  *                                                                           *
  ****************************************************************************/

// Find all trains
exports.findAllTrains = {
    'spec': {
        'description': 'Train operations',
        'path': '/train',
        'notes': 'Returns a collection of trains',
        'summary': 'Get all trains',
        'method': 'GET',
        'type': 'Train',
        'responseMessages': [{
            "code": 200,
            "message": "Collection of trains returned"
        }, {
            "code": 404,
            "message": "No trains found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getAllTrains',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

// Find one train
exports.findOneTrain = {
    'spec': {
        'description': 'Train operations',
        'path': '/train/{trainID}',
        'notes': 'Returns a train based on ID',
        'summary': 'Get one train',
        'method': 'GET',
        'parameters' : [{
            'name': 'trainID',
            'description': 'ID of Train to find',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'type': 'Train',
        'responseMessages': [{
            "code": 200,
            "message": "Train with specified Train ID returned"
        }, {
            "code": 404,
            "message": "No train with that Train ID found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getOneTrain',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

//Add a train
exports.addTrain = {
    'spec': {
        'description': 'Train operations',
        'path': '/train',
        'notes': 'Adds a new train with a randomly generated ID using an OAuth2 Access Token',
        'summary': 'Add one train using an Access Token',
        'method': 'POST',
        'type': 'Train',
        'responseMessages': [{
            "code": 201,
            "message": "New Train successfully created"
        }, {
            "code": 401,
            "message": "Not authorized to create a new Train"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'postTrain',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Edit a train
exports.editTrain = {
    'spec': {
        'description': 'Train operations',
        'path': '/train/{trainID}',
        'notes': 'Edit a train with its ID using an OAuth2 Access Token',
        'summary': 'Edit one train using an Access Token',
        'method': 'PUT',
        'type': 'Train',
        'parameters' : [{
            'name': 'trainID',
            'description': 'ID of Train to edit',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Train successfully updated"
        }, {
            "code": 401,
            "message": "Not authorized to edit a Train"
        }, {
            "code": 404,
            "message": "Train not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'putTrain',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Delete a train
exports.deleteTrain = {
    'spec': {
        'description': 'Train operations',
        'path': '/train/{trainID}',
        'notes': 'Delete a train with its ID using an OAuth2 Access Token',
        'summary': 'Delete one train using an Access Token',
        'method': 'DELETE',
        'type': 'Train',
        'parameters' : [{
            'name': 'trainID',
            'description': 'ID of Train to delete',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Train successfully deleted"
        }, {
            "code": 401,
            "message": "Not authorized to delete a Train"
        }, {
            "code": 404,
            "message": "Train not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'deleteTrain',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Search for a Train
exports.trainSearch = {
    'spec': {
        'description': 'Train operations',
        'path': '/train/search',
        'notes': 'Search for a Train based on an attribute',
        'summary': 'Search for a Train',
        'method': 'POST',
        'type': 'Train',
        'parameters': [{
            'name': 'search',
            'description': 'The search criteria',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'searchBy',
            'description': 'The attribute to search by',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'enum': ['id', 'arrivalPlatform', 'arrivalStation', 'arrivalTime', 'departurePlatform', 'departureStation', 'departureTime', 'latitude', 'longitude', 'trainName', 'trainNumber']
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Search Results returned'
        }, {
            'code': 403,
            'message': 'Search By value not permitted'
        }, {
            'code': 404,
            'message': 'No results found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'trainSearch',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * Flight Specifications                                                     *
  *                                                                           *
  ****************************************************************************/

// Find all flights
exports.findAllFlights = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight',
        'notes': 'Returns a collection of flights',
        'summary': 'Get all flights',
        'method': 'GET',
        'type': 'Flight',
        'responseMessages': [{
            "code": 200,
            "message": "Collection of flights returned"
        }, {
            "code": 404,
            "message": "No flights found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getAllFlights',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

// Find one flight
exports.findOneFlight = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight/{flightID}',
        'notes': 'Returns a flight based on ID',
        'summary': 'Get one flight',
        'method': 'GET',
        'parameters' : [{
            'name': 'flightID',
            'description': 'ID of Flight to find',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'type': 'Flight',
        'responseMessages': [{
            "code": 200,
            "message": "Flight with specified Flight ID returned"
        }, {
            "code": 404,
            "message": "No flight with that Flight ID found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getOneFlight',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
};

//Add a flight
exports.addFlight = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight',
        'notes': 'Adds a new flight with a randomly generated ID using an OAuth2 Access Token',
        'summary': 'Add one flight using an Access Token',
        'method': 'POST',
        'type': 'Flight',
        'responseMessages': [{
            "code": 201,
            "message": "New Flight successfully created"
        }, {
            "code": 401,
            "message": "Not authorized to create a new Flight"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'postFlight',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Edit a flight
exports.editFlight = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight/{flightID}',
        'notes': 'Edit a flight with its ID using an OAuth2 Access Token',
        'summary': 'Edit one flight using an Access Token',
        'method': 'PUT',
        'type': 'Flight',
        'parameters' : [{
            'name': 'flightID',
            'description': 'ID of Flight to edit',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Flight successfully updated"
        }, {
            "code": 401,
            "message": "Not authorized to edit a Flight"
        }, {
            "code": 404,
            "message": "Flight not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'putFlight',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Delete a flight
exports.deleteFlight = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight/{flightID}',
        'notes': 'Delete a flight with its ID using an OAuth2 Access Token',
        'summary': 'Delete one flight using an Access Token',
        'method': 'DELETE',
        'type': 'Flight',
        'parameters' : [{
            'name': 'flightID',
            'description': 'ID of Flight to delete',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Flight successfully deleted"
        }, {
            "code": 401,
            "message": "Not authorized to delete a Flight"
        }, {
            "code": 404,
            "message": "Flight not found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'deleteFlight',
        'produces': ["application/json"]
    },
    'action': function(req, res) {}
}

//Search for a Flight
exports.flightSearch = {
    'spec': {
        'description': 'Flight operations',
        'path': '/flight/search',
        'notes': 'Search for a Flight based on an attribute',
        'summary': 'Search for a Flight',
        'method': 'POST',
        'type': 'Flight',
        'parameters': [{
            'name': 'search',
            'description': 'The search criteria',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'searchBy',
            'description': 'The attribute to search by',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'enum': ['id', 'aircraft', 'arrivalTime', 'departureAirport', 'departureTime', 'flightDistance', 'flightNumber', 'latitude', 'longitude']
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Search Results returned'
        }, {
            'code': 403,
            'message': 'Search By value not permitted'
        }, {
            'code': 404,
            'message': 'No results found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'flightSearch',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * Client Specifications                                                     *
  *                                                                           *
  ****************************************************************************/

//Find all clients
exports.findAllClients = {
    'spec': {
        'description': 'Client operations',
        'path': '/client',
        'notes': 'Returns a collection of clients for the admin',
        'summary': 'Get all clients --admin only',
        'method': 'GET',
        'type': 'Client',
        'responseMessages': [{
            "code": 200,
            "message": "Collection of clients returned"
        }, {
            "code": 401,
            "message": "No admin authenticated"
        }, {
            "code": 404,
            "message": "No clients found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getAllClients',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
}

exports.findOneClient = {
    'spec': {
        'description': 'Client operations',
        'path': '/client/{clientID}',
        'notes': 'Returns a client by client ID for the admin',
        'summary': 'Get one client --admin only',
        'method': 'GET',
        'type': 'Client',
        'parameters' : [{
            'name': 'clientID',
            'description': 'ID of Client to find',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Client returned"
        }, {
            "code": 401,
            "message": "No admin authenticated"
        }, {
            "code": 404,
            "message": "No client found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'getOneClient',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
}

exports.addClient = {
    'spec': {
        'description': 'Client operations',
        'path': '/client',
        'notes': 'Creates a new Client with a randomly generated ID',
        'summary': 'Create a Client',
        'method': 'POST',
        'type': 'Client',
        'parameters': [{
            'name': 'name',
            'description': 'The name of the client',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'redirectURI',
            'description': 'The URI to redirect the client to with the OAuth2 authorization code',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'success'
        }],
        'responseMessages': [{
            "code": 201,
            "message": "New client created"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'postClient',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
}

exports.editClient = {
    'spec': {
        'description': 'Client operations',
        'path': '/client/{clientID}',
        'notes': 'Edit a client by client ID as an admin',
        'summary': 'Edit one client --admin only',
        'method': 'PUT',
        'type': 'Client',
        'parameters' : [{
            'name': 'clientID',
            'description': 'ID of Client to edit',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }, {
            'name': 'name',
            'description': 'The name of the client',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'redirectURI',
            'description': 'The URI to redirect the client to with the OAuth2 authorization code',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'defaultValue': 'success'
        }, {
            'name': 'trusted',
            'description': 'A true or false value determining whether a client has access to the Bus, Train and Flight routes',
            'type': 'boolean',
            'required': true,
            'paramType': 'form',
            'defaultValue': false
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Client updated"
        }, {
            "code": 401,
            "message": "No admin authenticated"
        }, {
            "code": 404,
            "message": "No client found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'putClient',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
}

exports.deleteClient = {
    'spec': {
        'description': 'Client operations',
        'path': '/client/{clientID}',
        'notes': 'Delete a client by client ID as an admin',
        'summary': 'Delete one client --admin only',
        'method': 'DELETE',
        'type': 'Client',
        'parameters' : [{
            'name': 'clientID',
            'description': 'ID of Client to delete',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            "code": 200,
            "message": "Client deleted"
        }, {
            "code": 401,
            "message": "No admin authenticated"
        }, {
            "code": 404,
            "message": "No client found"
        }, {
            "code": 500,
            "message": "Internal server error"
        }],
        'nickname': 'deleteClient',
        'produces': ["application/vnd.collection+json"]
    },
    'action': function(req, res) {}
}

exports.clientSearch = {
    'spec': {
        'description': 'Client operations',
        'path': '/client/search',
        'notes': 'Search for a client by specified attribute as an admin',
        'summary': 'Search for a client --admin only',
        'method': 'POST',
        'type': 'Client',
        'parameters': [{
            'name': 'search',
            'description': 'The search criteria',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'searchBy',
            'description': 'The attribute to search by',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'enum': ['id', 'clientId', 'clientSecret', 'name', 'redirectURI', 'trusted']
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Search Results returned'
        }, {
            'code': 401,
            'message': 'No admin authenticated'
        }, {
            'code': 403,
            'message': 'Search By value not permitted'
        }, {
            'code': 404,
            'message': 'No results found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'clientSearch',
        'produces': ["application/vnd.collection+json"]
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
            'code': 401,
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
            'code': 401,
            'message': 'No user authenticated'
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

//Get all users
exports.findAllUsers = {
    'spec': {
        'description': 'User operations',
        'path': '/user/all',
        'notes': 'Returns all users as an admin',
        'summary': 'Get all users --admin only',
        'method': 'GET',
        'type': 'User',
        'responseMessages': [{
            'code': 200,
            'message': 'All users profile returned'
        }, {
            'code': 401,
            'message': 'No admin authenticated'
        }, {
            'code': 404,
            'message': 'No users found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'getAllUsers',
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
        }, {
            'name': 'name',
            'description': 'The full name of the user',
            'type': 'string',
            'paramType': 'form'
        }, {
            'name': 'email',
            'description': 'The email address of the user',
            'type': 'string',
            'paramType': 'form',
            'required': true
        }, {
            'name': 'bday',
            'description': 'The date of birth of the user',
            'type': 'date',
            'paramType': 'form'
        }],
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

//Edit the current user
exports.editCurrentUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user',
        'notes': 'Edit the currently logged in user',
        'summary': 'Edit the current user',
        'method': 'PUT',
        'type': 'User',
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
        }, {
            'name': 'name',
            'description': 'The full name of the user',
            'type': 'string',
            'paramType': 'form'
        }, {
            'name': 'email',
            'description': 'The email address of the user',
            'type': 'string',
            'paramType': 'form',
            'required': true
        }, {
            'name': 'bday',
            'description': 'The date of birth of the user',
            'type': 'date',
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User updated'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 403,
            'message': 'Value to edit not permitted'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'putCurrentUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Edit a user
exports.editOneUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user/{userID}',
        'notes': 'Edit a user as an admin',
        'summary': 'Edit a user by user ID --admin only',
        'method': 'PUT',
        'type': 'User',
        'parameters': [{
            'name': 'userID',
            'description': 'ID of User to edit',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }, {
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
        }, {
            'name': 'name',
            'description': 'The full name of the user',
            'type': 'string',
            'paramType': 'form'
        }, {
            'name': 'email',
            'description': 'The email address of the user',
            'type': 'string',
            'paramType': 'form',
            'required': true
        }, {
            'name': 'bday',
            'description': 'The date of birth of the user',
            'type': 'date',
            'paramType': 'form'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User updated'
        }, {
            'code': 401,
            'message': 'No admin authenticated'
        }, {
            'code': 403,
            'message': 'Value to edit not permitted'
        }, {
            'code': 404,
            'message': 'User not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'putOneUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete the current user
exports.deleteCurrentUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user',
        'notes': 'Delete the currently logged in user',
        'summary': 'Delete the current user',
        'method': 'DELETE',
        'type': 'User',
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteCurrentUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete a user
exports.deleteOneUser = {
    'spec': {
        'description': 'User operations',
        'path': '/user/{userID}',
        'notes': 'Delete a user as an admin',
        'summary': 'Delete a user by user ID --admin only',
        'method': 'DELETE',
        'type': 'User',
        'parameters': [{
            'name': 'userID',
            'description': 'ID of User to delete',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted'
        }, {
            'code': 401,
            'message': 'No admin authenticated'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteCurrentUser',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Add a Friend
exports.addFriend = {
    'spec': {
        'description': 'User operations',
        'path': '/user/friends/{username}',
        'notes': 'Add a friend to the currently logged in user',
        'summary': 'Add a Friend to current user',
        'method': 'PUT',
        'type': 'User',
        'parameters': [{
            'name': 'username',
            'description': 'Username of user to add as a friend',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Friend added'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested friend not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'addFriend',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete a friend
exports.deleteFriend = {
    'spec': {
        'description': 'User operations',
        'path': '/user/friends/{username}',
        'notes': 'Delete a friend of the currently logged in user',
        'summary': 'Delete a Friend of current user',
        'method': 'DELETE',
        'type': 'User',
        'parameters': [{
            'name': 'username',
            'description': 'Username of user to delete as a friend',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested username not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteFriend',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Search for a User
exports.userSearch = {
    'spec': {
        'description': 'User operations',
        'path': '/user/search',
        'notes': 'Search for a User based on an attribute',
        'summary': 'Search for a User',
        'method': 'POST',
        'type': 'User',
        'parameters': [{
            'name': 'search',
            'description': 'The search criteria',
            'type': 'string',
            'required': true,
            'paramType': 'form'
        }, {
            'name': 'searchBy',
            'description': 'The attribute to search by',
            'type': 'string',
            'required': true,
            'paramType': 'form',
            'enum': ['name', 'nickname', 'email', 'bday']
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'Search Results returned'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 403,
            'message': 'Search By value not permitted'
        }, {
            'code': 404,
            'message': 'No results found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'userSearch',
        'produces': ['application/vnd.collection+json']
    },
    'action': function(req, res) {}
}

//Add current user to bus
exports.addToBus = {
    'spec': {
        'description': 'User operations',
        'path': '/user/bus/{busID}',
        'notes': 'Add current user to bus by bus ID',
        'summary': 'Add current user to bus',
        'method': 'PUT',
        'type': 'User',
        'parameters': [{
            'name': 'busID',
            'description': 'ID of the Bus to add the user to',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User added to bus'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested bus not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'addToBus',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete current user from bus
exports.deleteFromBus = {
    'spec': {
        'description': 'User operations',
        'path': '/user/bus/{busID}',
        'notes': 'Delete current user from bus by bus ID',
        'summary': 'Delete current user from bus',
        'method': 'DELETE',
        'type': 'User',
        'parameters': [{
            'name': 'busID',
            'description': 'ID of the Bus to delete the user from',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted from bus'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested bus not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteFromBus',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Add current user to train
exports.addToTrain = {
    'spec': {
        'description': 'User operations',
        'path': '/user/train/{trainID}',
        'notes': 'Add current user to train by train ID',
        'summary': 'Add current user to train',
        'method': 'PUT',
        'type': 'User',
        'parameters': [{
            'name': 'trainID',
            'description': 'ID of the Train to add the user to',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User added to train'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested train not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'addToTrain',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete current user from train
exports.deleteFromTrain = {
    'spec': {
        'description': 'User operations',
        'path': '/user/train/{trainID}',
        'notes': 'Delete current user from train by train ID',
        'summary': 'Delete current user from train',
        'method': 'DELETE',
        'type': 'User',
        'parameters': [{
            'name': 'trainID',
            'description': 'ID of the Train to delete the user from',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted from train'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested train not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteFromTrain',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Add current user to train
exports.addToFlight = {
    'spec': {
        'description': 'User operations',
        'path': '/user/flight/{flightID}',
        'notes': 'Add current user to flight by flight ID',
        'summary': 'Add current user to flight',
        'method': 'PUT',
        'type': 'User',
        'parameters': [{
            'name': 'flightID',
            'description': 'ID of the Flight to add the user to',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User added to flight'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested flight not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'addToFlight',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

//Delete current user from flight
exports.deleteFromFlight = {
    'spec': {
        'description': 'User operations',
        'path': '/user/flight/{flightID}',
        'notes': 'Delete current user from flight by flight ID',
        'summary': 'Delete current user from flight',
        'method': 'DELETE',
        'type': 'User',
        'parameters': [{
            'name': 'flightID',
            'description': 'ID of the Flight to delete the user from',
            'type': 'string',
            'required': true,
            'paramType': 'path'
        }],
        'responseMessages': [{
            'code': 200,
            'message': 'User deleted from flight'
        }, {
            'code': 401,
            'message': 'No user authenticated'
        }, {
            'code': 404,
            'message': 'Requested flight not found'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'deleteFromFlight',
        'produces': ['application/json']
    },
    'action': function(req, res) {}
}

  /****************************************************************************
  *                                                                           *
  * Authentication Specifications                                             *
  *                                                                           *
  ****************************************************************************/

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

exports.loggedInCheck = {
    'spec': {
        'description': 'User authentication operations',
        'path': '/login',
        'notes': 'Check to see which user is logged in',
        'summary': 'Verify login',
        'method': 'GET',
        'responseMessages': [{
            'code': 200,
            'message': 'User is logged in'
        }, {
            'code': 401,
            'message': 'No user logged in'
        }, {
            'code': 500,
            'message': 'Internal server error'
        }],
        'nickname': 'loggedInCheck',
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
            'description': 'The scope you wish to access',
            'type': 'string',
            'required': true,
            'paramType': 'query',
            'enum': ['write:bus', 'write:flight', 'write:train']
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