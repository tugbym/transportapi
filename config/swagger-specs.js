// Controllers to use
var BusController = require('../api/controllers/BusController.js');

// Create specs
exports.findAll = {
    'spec': {
        'description': 'Bus operations',
        'path': '/api/bus',
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
    'action': function(req, res) {
        var docs = BusController.read(req, res);
    }
};