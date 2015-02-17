/**
* Train.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      arrivalPlatform: { type: 'integer' },
      arrivalStation: { type: 'string' },
      arrivalTime: { type: 'datetime' },
      departurePlatform: { type: 'integer' },
      departureStation: { type: 'string' },
      departureTime: { type: 'datetime' },
      latitude: { type: 'float', required: true },
      longitude: { type: 'float', required: true },
      trainName: { type: 'string' },
      trainNumber: { type: 'integer' }
  }
};