/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      name: { type: 'string' },
      nickname: { type: 'string', required: true },
      photo: { type: 'string' },
      email: { type: 'string' },
      bday: { type: 'date' },
      pass: { type: 'string' }
  },
    
  beforeCreate: function (req, next) {
      var bcrypt = require('bcrypt');
      
      bcrypt.genSalt(10, function(err, salt) {
          
          if (err) {
              return next(err);
          }
          
          bcrypt.hash(req.pass, salt, function(err, hash) {
              
              if (err) {
                  return next(err);
              }
              
              req.pass = hash;
              next();
              
          });
      });
  }
    
};

