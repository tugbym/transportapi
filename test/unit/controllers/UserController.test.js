var request = require('supertest');
var agent = request.agent('http://fiesta-collect.codio.io:3000');
var should = require('should');

describe('User Route', function() {
    
    it('post with invalid data should return 500 response code', function(done) {
        agent
            .post('/api/user')
            .send({invalid: 'invalid'})
            .expect(500, done)
    });
    
    it('post with valid data should return 201 response code', function(done) {
        agent
            .post('/api/user')
            .send({username: 'mocha', password: 'testing', bday: '01/01/01 01:01'})
            .expect(201, done)
    });
    
    it('new user should now exist', function(done) {
        agent
            .post('/api/login')
            .send({username: 'mocha', password: 'testing'})
            .expect(200, done)
    });
    
    it('get should return 200 response code', function(done) {
        agent
            .get('/api/user')
            .expect(200, done)
    });
    
    it('post valid search should return 200 response code', function(done) {
        agent
            .post('/api/user/search')
            .send({search: 'admin', searchBy: 'nickname'})
            .expect(200, done)
    });
    
    it('get with invalid id should return 404 response code', function(done) {
        agent
            .get('/api/user/123')
            .expect(404, done)
    });
    
    it('get with valid id should return 200 response code', function(done) {
        agent
            .post('/api/user/search')
            .send({search: 'admin', searchBy: 'nickname'})
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].data;
                var userID;
                for (var i = 0; i<json.length; i++) {
                    if (json[i].name == 'id') {
                        userID = json[i].value;
                    }
                }
                agent
                    .get('/api/user/' + userID)
                    .expect(200, done)
            });
    });
    
    it('put with invalid data should return 403 response code', function(done) {
        agent
            .put('/api/user')
            .send({invalid: 'invalid'})
            .expect(403, done)
    })
    
    it('put with valid data and valid id should return 200 response code', function(done) {
        agent
            .put('/api/user')
            .send({name: 'Testing'})
            .expect(200, done)
    });
    
    it('delete with valid id should return 200 response code', function(done) {
        agent
            .delete('/api/user')
            .expect(200, done)
    });
    
});