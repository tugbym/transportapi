var request = require('supertest');

describe('Flight Route', function() {
        
    it('should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .get('/flight')
            .expect(401, done)
    });
        
    it('should return vnd.collection+json', function(done) {
        request(sails.hooks.http.app)
            .get('/flight')
            .expect('Content-Type', /application\/json/, done)
    });
        
});