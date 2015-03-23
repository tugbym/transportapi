// Create models
exports.models = {
    "User": {
        "id": "User",
        "required": ["username", "password", "email"],
        "properties": {
            "username": {
                "type": "string",
                "description": "The username of the user"
            },
            "password": {
                "type": "string",
                "description": "The password of the user"
            },
            "name": {
                "type": "string",
                "description": "The full name of the user"
            },
            "email": {
                "type": "string",
                "description": "The email address of the user"
            },
            "bday": {
                "type": "string",
                "format": "date",
                "description": "The date of birth of the user"
            },
            "friends": {
                "type": "array",
                "description": "The list of friends of the user"
            },
            "transportID": {
                "type": "string",
                "description": "The ID of the transport the user is currently on"
            },
            "transportType": {
                "type": "string",
                "description": "The type of transport the user is currently on"
            }
        }
    },
    "Bus": {
        "id": "Bus",
        "required": ["latitude", "longitude"],
        "properties": {
            "arrivalBusStop": {
                "type": "string",
                "description": "The next bus stop that the bus will arrive at"
            },
            "arrivalTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the bus will arrive at the next bus stop"
            },
            "busName": {
                "type": "string",
                "description": "The name of the bus"
            },
            "busNumber": {
                "type": "integer",
                "description": "The number of the bus"
            },
            "departureBusStop": {
                "type": "string",
                "description": "The previous bus stop that the bus departed from"
            },
            "departureTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the bus departed from the previous bus stop"
            },
            "latitude": {
                "type": "number",
                "format": "float",
                "description": "The latitude of the bus"
            },
            "longitude": {
                "type": "number",
                "format": "float",
                "description": "The longitude of the bus"
            }
        }
    },
    "Train": {
        "id": "Train",
        "required": ["latitude", "longitude"],
        "properties": {
            "arrivalPlatform": {
                "type": "integer",
                "description": "The next train platform that the train will arrive at"
            },
            "arrivalStation": {
                "type": "string",
                "description": "The next train station that the train will arrive at"
            },
            "arrivalTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the train will arrive at the next train platform"
            },
            "departurePlatform": {
                "type": "integer",
                "description": "The previous train platform that the train departed from"
            },
            "departureStation": {
                "type": "string",
                "description": "The previous train station that the train departed from"
            },
            "departureTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the train departed from the previous train platform"
            },
            "latitude": {
                "type": "number",
                "format": "float",
                "description": "The latitude of the train"
            },
            "longitude": {
                "type": "number",
                "format": "float",
                "description": "The longitude of the train"
            },
            "trainName": {
                "type": "string",
                "description": "The name of the trains company"
            },
            "trainNumber": {
                "type": "integer",
                "description": "The number of the train"
            }
        }
    },
    "Flight": {
        "id": "Flight",
        "required": ["latitude", "longitude"],
        "properties": {
            "aircraft": {
                "type": "string",
                "description": "The kind of aircraft (eg. Boeing 747)"
            },
            "arrivalAirport": {
                "type": "string",
                "description": "The name of the next airport that the aircraft will arrive at"
            },
            "arrivalTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the aircraft will arrive at the next airport"
            },
            "departureAirport": {
                "type": "string",
                "description": "The name of the previous airport that the aircraft departed from"
            },
            "departureTime": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time the aircraft departed from the previous airport"
            },
            "flightDistance": {
                "type": "number",
                "format": "float",
                "description": "The distance that the flight will travel, in miles"
            },
            "flightNumber": {
                "type": "string",
                "description": "The IATA code of the airline, plus the unique flight identifier (eg. UA110)"
            },
            "latitude": {
                "type": "number",
                "format": "float",
                "description": "The latitude of the flight"
            },
            "longitude": {
                "type": "number",
                "format": "float",
                "description": "The longitude of the flight"
            }
        }
    },
    "Client": {
        "id": "Client",
        "required": ["name", "redirectURI"],
        "properties": {
            "name": {
                "type": "string",
                "description": "The name of the client"
            },
            "redirectURI": {
                "type": "string",
                "description": "The URI to redirect the client to with their OAuth2 authentication code"
            },
            "clientId": {
                "type": "string",
                "description": "A randomly generated number of the client to be used in the OAuth2 workflow"
            },
            "clientSecret": {
                "type": "string",
                "description": "A randomly generated number of the client to be used in the OAuth2 workflow"
            },
            "trusted": {
                "type": "boolean",
                "description": "A true or false value set by the server admin to grant or revoke access to the Bus, Train and Flight routes"
            }
        }
    }
};