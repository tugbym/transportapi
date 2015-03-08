var request = require('supertest');

describe('Train Route', function() {
        
    it('should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .get('/api/train')
            .expect(200, done)
    });
        
    it('should return vnd.collection+json', function(done) {
        request(sails.hooks.http.app)
            .get('/api/train')
            .expect('Content-Type', /vnd.collection\+json/, done)
    });
        
});