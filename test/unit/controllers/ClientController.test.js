var request = require('supertest');
var agent = request.agent('http://project-hydra-44013.onmodulus.net');
var should = require('should');

describe('Client Route', function() {
    
    before(function(done) {
        agent
            .post('/api/login')
            .send({username: 'admin', password: 'Admin5050'})
            .expect(200, done)
    });
    
    it('get all should return 200 response code', function(done) {
        agent
            .get('/api/client')
            .expect(200, done)
    });
    
    it('post with invalid data should return 500 response code', function(done) {
        agent
            .post('/api/client')
            .send({name: '0'})
            .expect(500, done)
    });
    
    it('post with valid data should return 201 response code', function(done) {
        agent
            .post('/api/client')
            .send({name: 'TestClient', redirectURI: 'www.test.com'})
            .expect(201, done)
    });
    
    it('get one client with invalid id should return 404 response code', function(done) {
        agent
            .get('/api/client/123')
            .expect(404, done)
    });
    
    it('get one client with valid id should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'TestClient', searchBy: 'name'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'id') {
                        clientID = data[i].value;
                    }
                }
                agent
                    .get('/api/client/' + clientID)
                    .expect(200, done)
            });
    });
    
    it('put with invalid data should return 403 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'TestClient', searchBy: 'name'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'id') {
                        clientID = data[i].value;
                    }
                }
                agent
                    .put('/api/client/' + clientID)
                    .send({invalidData: 'invalid'})
                    .expect(403, done)
            });
    });
    
    it('put with invalid id should return 404 response code', function(done) {
         agent
            .put('/api/client/123')
            .send({trusted: true})
            .expect(404, done)
    });
    
    it('put with valid data should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'TestClient', searchBy: 'name'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'id') {
                        clientID = data[i].value;
                    }
                }
                agent
                    .put('/api/client/' + clientID)
                    .send({trusted: true})
                    .expect(200, done)
            });
    });
    
    it('delete with invalid id should return 404 response code', function(done) {
        agent
            .delete('/api/client/123')
            .expect(404, done)
    });
    
    it('delete should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'TestClient', searchBy: 'name'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'id') {
                        clientID = data[i].value;
                    }
                }
                agent
                    .delete('/api/client/' + clientID)
                    .expect(200, done)
            });
    });
    
});