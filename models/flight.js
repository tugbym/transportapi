var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var flightSchema = new Schema({
    aircraft: {
        type: String,
        required: true
    },
    arrivalAirport: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    departureAirport: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    flightDistance: {
        type: String,
        required: true
    },
    flightNumber: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    geo: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
});

var flight = mongoose.model('flight', flightSchema);

module.exports = {
    Flight: flight
};