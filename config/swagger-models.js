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
                "description": "The time the bus will arrive at the next bus stop"
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
                "description": "The time the bus departed from the previous bus stop"
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
    }
};