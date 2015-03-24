var request = require('supertest');
var agent = request.agent('http://localhost:3000');
var should = require('chai').should();

describe('Bus Route', function() {
    
    before(function(done) {
        agent
            .post('/api/login')
            .send({username: 'admin', password: 'Admin5050'})
            .expect(200, done)
    });
        
    it('get should return 200 response code', function(done) {
        agent
            .get('/api/bus')
            .expect(200, done)
    });
        
    it('get should return vnd.collection+json', function(done) {
        agent
            .get('/api/bus')
            .expect('Content-Type', /vnd.collection\+json/, done)
    });
    
    it('post with invalid access token should return 401 response code', function(done) {
        agent
            .post('/api/bus')
            .set('Authorization', 'Bearer 123')
            .send({arrivalTime: '01/01/01 01:01', departureTime: '01/01/01 11:11', latitude: '56.75', longitude: '45.35'})
            .expect(401, done)
    });
    
    it('post with valid access token should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'MochaTest', searchBy: 'name'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                var clientSecret;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'clientId') {
                        clientID = data[i].value;
                    }
                    if (data[i].name == 'clientSecret') {
                        clientSecret = data[i].value;
                    }
                }
                agent
                    .post('/api/oauth/token')
                    .send({grant_type: 'password', client_id: clientID, client_secret: clientSecret, username: 'admin', password: 'Admin5050', scope: 'write:bus'})
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        var json = JSON.parse(res.text);
                        json.should.be.an.instanceOf(Object).and.have.property('access_token');
                    
                        agent
                            .post('/api/bus')
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .send({arrivalTime: '01/01/01 01:01', departureTime: '01/01/01 11:11', latitude: '56.75', longitude: '45.35'})
                            .expect(201, done)
                    });
            });
    });
    
    it('put with invalid token and invalid id should return 401 response code', function(done) {
        agent
            .put('/api/bus/123')
            .set('Authorization', 'Bearer 123')
            .expect(401, done)
    });
    
    it('put with valid token and invalid id should return 403 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'MochaTest', searchBy: 'name'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                var clientSecret;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'clientId') {
                        clientID = data[i].value;
                    }
                    if (data[i].name == 'clientSecret') {
                        clientSecret = data[i].value;
                    }
                }
                agent
                    .post('/api/oauth/token')
                    .send({grant_type: 'password', client_id: clientID, client_secret: clientSecret, username: 'admin', password: 'Admin5050', scope: 'write:bus'})
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        var json = JSON.parse(res.text);
                        json.should.be.an.instanceOf(Object).and.have.property('access_token');
            
                        agent
                            .put('/api/bus/123')
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .send({longitude: '12.12'})
                            .expect(403, done)
                    });
            });
    });
    
    it('put with valid access token and valid id should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'MochaTest', searchBy: 'name'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                var clientSecret;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'clientId') {
                        clientID = data[i].value;
                    }
                    if (data[i].name == 'clientSecret') {
                        clientSecret = data[i].value;
                    }
                }
                agent
                    .post('/api/oauth/token')
                    .send({grant_type: 'password', client_id: clientID, client_secret: clientSecret, username: 'admin', password: 'Admin5050', scope: 'write:bus'})
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        var json = JSON.parse(res.text);
                        json.should.be.an.instanceOf(Object).and.have.property('access_token');
                
                        agent
                            .post('/api/bus/search')
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .send({search: '45.35', searchBy: 'longitude'})
                            .expect(200)
                            .end(function (err, res) {
                                should.not.exist(err);
                                var json2 = JSON.parse(res.text);
                                json2 = json2.collection.items[0].data;
                                var busID;
                                for (var i = 0; i<json2.length; i++) {
                                    if (json2[i].name == 'id') {
                                        busID = json2[i].value;
                                    }
                                }
                    
                                agent
                                    .put('/api/bus/' + busID)
                                    .set('Authorization', 'Bearer ' + json.access_token)
                                    .send({longitude: '12.12'})
                                    .expect(200, done)
                            });
                    });
            });
    });
    
    it('delete with invalid access token and invalid id should return 401 response code', function(done) {
        agent
            .delete('/api/bus/123')
            .set('Authorization', 'Bearer 123')
            .expect(401, done)
    });
        
    it('delete with valid token and invalid id should return 403 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'MochaTest', searchBy: 'name'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                var clientSecret;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'clientId') {
                        clientID = data[i].value;
                    }
                    if (data[i].name == 'clientSecret') {
                        clientSecret = data[i].value;
                    }
                }
                agent
                    .post('/api/oauth/token')
                    .send({grant_type: 'password', client_id: clientID, client_secret: clientSecret, username: 'admin', password: 'Admin5050', scope: 'write:bus'})
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        var json = JSON.parse(res.text);
                        json.should.be.an.instanceOf(Object).and.have.property('access_token');
            
                        agent
                            .delete('/api/bus/123')
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .expect(403, done)
                    });
            });
    });
    
    it('delete with valid access token and valid id should return 200 response code', function(done) {
        agent
            .post('/api/client/search')
            .send({search: 'MochaTest', searchBy: 'name'})
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                var data = json.collection.items[0].data
                var clientID;
                var clientSecret;
                for (var i = 0; i<data.length; i++) {
                    if (data[i].name == 'clientId') {
                        clientID = data[i].value;
                    }
                    if (data[i].name == 'clientSecret') {
                        clientSecret = data[i].value;
                    }
                }
                agent
                    .post('/api/oauth/token')
                    .send({grant_type: 'password', client_id: clientID, client_secret: clientSecret, username: 'admin', password: 'Admin5050', scope: 'write:bus'})
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        var json = JSON.parse(res.text);
                        json.should.be.an.instanceOf(Object).and.have.property('access_token');
                
                        agent
                            .post('/api/bus/search')
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .send({search: '12.12', searchBy: 'longitude'})
                            .expect(200)
                            .end(function (err, res) {
                                should.not.exist(err);
                                var json2 = JSON.parse(res.text);
                                json2 = json2.collection.items[0].data;
                                var busID;
                                for (var i = 0; i<json2.length; i++) {
                                    if (json2[i].name == 'id') {
                                        busID = json2[i].value;
                                    }
                                }
                    
                                agent
                                    .delete('/api/bus/' + busID)
                                    .set('Authorization', 'Bearer ' + json.access_token)
                                    .expect(200, done)
                            });
                    });
            });
    });
        
});