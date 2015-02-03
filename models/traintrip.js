var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var trainTripSchema = new Schema({
    arrivalPlatform: {
        type: Number,
        required: true
    },
    arrivalStation: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    departurePlatform: {
        type: Number,
        required: true
    },
    departureStation: {
        type: String,
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
    },
    trainName: {
        type: String,
        required: true
    },
    trainNumber: {
        type: Number,
        required: true
    }
});

var trainTrip = mongoose.model('trainTrip', trainTripSchema);

module.exports = {
    TrainTrip: trainTrip
};