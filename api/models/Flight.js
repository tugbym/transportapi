/**
 * Flight.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    attributes: {
        aircraft: {
            type: 'string'
        },
        arrivalAirport: {
            type: 'string'
        },
        arrivalTime: {
            type: 'datetime'
        },
        departureAirport: {
            type: 'string'
        },
        departureTime: {
            type: 'datetime'
        },
        flightDistance: {
            type: 'float'
        },
        flightNumber: {
            type: 'string'
        },
        latitude: {
            type: 'float',
            required: true
        },
        longitude: {
            type: 'float',
            required: true
        }
    }
};