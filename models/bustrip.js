var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var busTripSchema = new Schema({
    arrivalBusStop: {
        type: Number,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    busName: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    departureBusStop: {
        type: Number,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
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

var busTrip = mongoose.model('busTrip', busTripSchema);

module.exports = {
    BusTrip: busTrip
};