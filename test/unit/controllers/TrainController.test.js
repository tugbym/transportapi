var request = require('supertest');

describe('Train Route', function() {
        
    it('should return 200 response code', function(done) {
        request(sails.hooks.http.app)
            .get('/train')
            .expect(200, done)
    });
        
    it('should return vnd.collection+json', function(done) {
        request(sails.hooks.http.app)
            .get('/train')
            .expect('Content-Type', /vnd\.collection\+json/, done)
    });
        
});