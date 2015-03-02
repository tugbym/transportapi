/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // Create a user
  Users.findOne({email: 'me@gmail.com'}, function(err, user){
    if(!user){
      Users.create({
    nickname: 'default',
  	email: 'me@gmail.com',
  	password: 'password'
      }).exec(function(err,user){
          if (err) {
              return console.log("Error: " + err);
          }
  	    console.log("Default user created");
        console.log("- username: " + user.email);
        console.log("- password: password");
      });
    } else {
      console.log('Default user already exists');
      console.log("- username: " + user.email);
      console.log("- password: password");
    }
  });

  // Create a trusted application
  Client.findOne({'name': 'trustedTestClient'}, function(err, client){
    if(err){
      console.log(err.message);
    } else {
      if(!client){
        Client.create({name : 'trustedTestClient',
                       redirectURI: 'http://localhost:1338',
                       trusted: true
        }).exec(function(err, client){
          if(err){
            console.log(err.message);
          } else {
            console.log("trustedTestClient created");
            console.log("- client_id: " + client.clientId);
            console.log("- client_secret: " + client.clientSecret);
            console.log("- redirectURI: " + client.redirectURI);
          }
        });
      } else {
        console.log('trustedTestClient already exists');
        console.log("- client_id: " + client.clientId);
        console.log("- client_secret: " + client.clientSecret);
        console.log("- redirectURI: " + client.redirectURI);
      }
    }
  }); 

  // Create an untrusted application
  Client.findOne({'name': 'untrustedTestClient'}, function(err, client){
    if(err){
      console.log(err.message);
    } else {
      if(!client){
        Client.create({name : 'untrustedTestClient',
                       redirectURI: 'http://localhost:1339'
        }).exec(function(err, client){
          if(err){
            console.log(err.message);
          } else {
            console.log("untrustedTestClient created");
            console.log("- client_id: " + client.clientId);
            console.log("- client_secret: " + client.clientSecret);
            console.log("- redirectURI: " + client.redirectURI);
          }
        });
      } else {
        console.log('untrustedTestClient already exists');
        console.log("- client_id: " + client.clientId);
        console.log("- client_secret: " + client.clientSecret);
        console.log("- redirectURI: " + client.redirectURI);
      }
    }
  }); 

  cb();
};
