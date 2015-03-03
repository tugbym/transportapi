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

  // Create a trusted application
  Client.findOne({'name': 'TestClient'}, function(err, client){
    if(err){
      console.log(err.message);
    } else {
      if(!client){
        Client.create({name : 'TestClient',
                       trusted: true
        }).exec(function(err, client){
          if(err){
            console.log(err.message);
          } else {
            console.log("TestClient created");
            console.log("- client_id: " + client.clientId);
            console.log("- client_secret: " + client.clientSecret);
            console.log("- redirectURI: " + client.redirectURI);
          }
        });
      } else {
        console.log('TestClient');
        console.log("- client_id: " + client.clientId);
        console.log("- client_secret: " + client.clientSecret);
        console.log("- redirectURI: " + client.redirectURI);
      }
    }
  }); 

  cb();
};
