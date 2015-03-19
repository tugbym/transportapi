module.exports = {
    http: {
        customMiddleware: function(app) {
            
            var swagger = require('swagger-node-express').createNew(app);
            
            // Initialize swagger
            swagger.constructor(app);
            
            //Import models and specs
            var specs = require('./swagger-specs.js');
            var models = require('./swagger-models.js');
            
            // Add models
            swagger.addModels(models).addGet(specs.findAll)
            
            // Link it up
            swagger.configure('http://fiesta-collect.codio.io:3000', '0.1');
        }
    }
};