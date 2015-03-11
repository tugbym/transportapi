var request = require('supertest');
var agent = request.agent('http://localhost:3000');
var should = require('should');

describe('Auth Route', function() {
    
    //Create Test Fixtures
    before(function(done) {
        agent
            .post('/api/user')
            .send({username: 'admin', password: 'admin', bday: '01/01/01 01:01', email: 'test@example.com'})
            .expect(201)
            .end(function(err, res) {
                agent
                    .post('/api/user')
                    .send({username: 'test', password: 'test', bday: '01/01/01 01:01', email: 'test@example.com'})
                    .expect(201)
                    .end(function(err, res) {
                        agent
                            .post('/api/client')
                            .send({name: 'MochaTest', redirectURI: 'success'})
                            .expect(201)
                            .end(function(err, res) {
                                var data = JSON.parse(res.text);
                                var ID = data.id;
                                var clientID = data.clientId;
                                var clientSecret = data.clientSecret;
                                agent
                                    .post('/api/login')
                                    .send({username: 'admin', password: 'admin'})
                                    .expect(200)
                                    .end(function(err, res) {
                                        agent
                                            .put('/api/client/' + ID)
                                            .send({trusted: true})
                                            .expect(200, done)
                                    });
                            });
                    });
            });
    });
    
    describe('Login Route', function() {
        
        it('invalid login should return 403 response code', function (done) {
            agent
                .post('/api/login')
                .send({username: 'not_a_user', password: 'not_a_password'})
                .expect(403, done)
        });
    
        it('valid login should return 200 response code', function (done) {
            agent
                .post('/api/login')
                .send({username: 'admin', password: 'admin'})
                .expect(200, done)
        });
    
        it ('valid login should allow access to user route', function (done) {
            agent
                .get('/api/user')
                .expect(200, done)
        });
        
    });
    
    describe('Logout Route', function() {
        
        it ('logout should return 200 response code', function (done) {
            agent
                .get('/api/logout')
                .expect(200, done)
        });
    
        it ('not logged in user should not have access to user route', function (done) {
            agent
                .get('/api/user')
                .expect(403, done)
        });
        
        it ('not logged in admin should not have access to client route', function (done) {
            agent
                .get('/api/client')
                .expect(403, done)
        });
        
        it ('non admin user should not have access to client route', function (done) {
            agent
                .post('/api/login')
                .send({username: 'test', password: 'test'})
                .end(function(err, res) {
                    should.not.exist(err);
                    agent
                        .get('/api/client')
                        .expect(403)
                        .end(function(err, res) {
                            should.not.exist(err);
                            agent
                                .get('/api/logout')
                                .expect(200, done)
                        });
                });
        });
        
    });
    
});