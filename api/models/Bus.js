/**
* Bus.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    
  attributes: {
      arrivalBusStop: { type: 'integer' },
      arrivalTime: { type: 'datetime' },
      busName: { type: 'string' },
      busNumber: { type: 'integer' },
      departureBusStop: { type: 'integer' },
      departureTime: { type: 'datetime' },
      latitude: { type: 'float', required: true },
      longitude: { type: 'float', required: true }
  }
};