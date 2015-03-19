// Create models
exports.models = {
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