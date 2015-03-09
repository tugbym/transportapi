var request = require('supertest');
var agent = request.agent('http://fiesta-collect.codio.io:3000');
var should = require('should');

describe('User Route', function() {
    
    before(function(done) {
        agent
            .post('/api/login')
            .send({username: 'admin', password: 'admin'})
            .expect(200, done)
    });
    
    it('get should return 200 response code', function(done) {
        agent
            .get('/api/user')
            .expect(200, done)
    });
    
});