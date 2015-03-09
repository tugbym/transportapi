var request = require('supertest');
var agent = request.agent('http://fiesta-collect.codio.io:3000');
var should = require('should');

describe('Bus Route', function() {
        
    it('get should return 200 response code', function(done) {
        request(sails.hooks.http.app)
            .get('/api/bus')
            .expect(200, done)
    });
        
    it('get should return vnd.collection+json', function(done) {
        request(sails.hooks.http.app)
            .get('/api/bus')
            .expect('Content-Type', /vnd.collection\+json/, done)
    });
    
    it('post with invalid access token should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/bus')
            .set('Authorization', 'Bearer 123')
            .send({arrivalTime: '01/01/01 01:01', departureTime: '01/01/01 11:11', latitude: '56.75', longitude: '45.35'})
            .expect(401, done)
    });
    
    it('post with valid access token should return 200 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/oauth/token')
            .send({client_id: 'F43KLH9R9P', client_secret: 'fnPyh6Dq2U3m8zKEluichfdKZJX3p1', grant_type: 'authorization_code', redirect_uri: 'www.mochaTest.com', code: 'Vfy28wA2PBRQIPfk'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json.should.be.an.instanceOf(Object).and.have.property('access_token');
            
                request(sails.hooks.http.app)
                    .post('/api/bus')
                    .set('Authorization', 'Bearer ' + json.access_token)
                    .send({arrivalTime: '01/01/01 01:01', departureTime: '01/01/01 11:11', latitude: '56.75', longitude: '45.35'})
                    .expect(201, done)
                
            });
    });
    
    it('put with invalid token and invalid id should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .put('/api/bus/123')
            .set('Authorization', 'Bearer 123')
            .expect(401, done)
    });
    
    it('put with valid token and invalid id should return 404 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/oauth/token') 
            .send({client_id: 'F43KLH9R9P', client_secret: 'fnPyh6Dq2U3m8zKEluichfdKZJX3p1', grant_type: 'authorization_code', redirect_uri: 'www.mochaTest.com', code: 'Vfy28wA2PBRQIPfk'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json.should.be.an.instanceOf(Object).and.have.property('access_token');
            
                request(sails.hooks.http.app)
                    .put('/api/bus/123')
                    .set('Authorization', 'Bearer ' + json.access_token)
                    .send({longitude: '12.12'})
                    .expect(404, done)
            });
    });
    
    it('put with valid access token and valid id should return 200 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/oauth/token') 
            .send({client_id: 'F43KLH9R9P', client_secret: 'fnPyh6Dq2U3m8zKEluichfdKZJX3p1', grant_type: 'authorization_code', redirect_uri: 'www.mochaTest.com', code: 'Vfy28wA2PBRQIPfk'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json.should.be.an.instanceOf(Object).and.have.property('access_token');
                
                request(sails.hooks.http.app)
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
                    
                        request(sails.hooks.http.app)
                            .put('/api/bus/' + busID)
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .send({longitude: '12.12'})
                            .expect(200, done)
                    });
            });
    });
    
    it('delete with invalid access token and invalid id should return 401 response code', function(done) {
        request(sails.hooks.http.app)
            .delete('/api/bus/123')
            .set('Authorization', 'Bearer 123')
            .expect(401, done)
    });
        
    it('delete with valid token and invalid id should return 404 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/oauth/token') 
            .send({client_id: 'F43KLH9R9P', client_secret: 'fnPyh6Dq2U3m8zKEluichfdKZJX3p1', grant_type: 'authorization_code', redirect_uri: 'www.mochaTest.com', code: 'Vfy28wA2PBRQIPfk'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json.should.be.an.instanceOf(Object).and.have.property('access_token');
            
                request(sails.hooks.http.app)
                    .delete('/api/bus/123')
                    .set('Authorization', 'Bearer ' + json.access_token)
                    .expect(404, done)
            });
    });
    
    it('delete with valid access token and valid id should return 200 response code', function(done) {
        request(sails.hooks.http.app)
            .post('/api/oauth/token') 
            .send({client_id: 'F43KLH9R9P', client_secret: 'fnPyh6Dq2U3m8zKEluichfdKZJX3p1', grant_type: 'authorization_code', redirect_uri: 'www.mochaTest.com', code: 'Vfy28wA2PBRQIPfk'})
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json.should.be.an.instanceOf(Object).and.have.property('access_token');
                
                request(sails.hooks.http.app)
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
                    
                        request(sails.hooks.http.app)
                            .delete('/api/bus/' + busID)
                            .set('Authorization', 'Bearer ' + json.access_token)
                            .expect(200, done)
                    });
            });
    });
        
});