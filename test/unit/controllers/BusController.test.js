var request = require('supertest');

describe('Bus Route', function() {
        
    it('should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .get('/api/bus')
            .expect(200, done)
    });
        
    it('should return vnd.collection+json', function(done) {
        request(sails.hooks.http.app)
            .get('/api/bus')
            .expect('Content-Type', /vnd.collection\+json/, done)
    });
        
});