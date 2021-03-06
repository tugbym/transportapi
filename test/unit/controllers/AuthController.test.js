var request = require('supertest');
var agent = request.agent('http://localhost:3000');
var should = require('chai').should();
describe('Auth Route', function() {
    describe('Login Route', function() {
        it('invalid login should return 404 response code', function(done) {
            agent.post('/api/user/login').send({
                username: 'not_a_user',
                password: 'not_a_password'
            }).expect(404, done)
        });
        it('valid login should return 200 response code', function(done) {
            agent.post('/api/user/login').send({
                username: 'admin',
                password: 'Admin5050'
            }).expect(200, done)
        });
        it('valid login should allow access to user route', function(done) {
            agent.get('/api/user').expect(200, done)
        });
    });
    describe('Logout Route', function() {
        it('logout should return 200 response code', function(done) {
            agent.get('/api/user/logout').expect(200, done)
        });
        it('not logged in user should not have access to user route', function(done) {
            agent.get('/api/user').expect(401, done)
        });
        it('not logged in admin should not have access to client route', function(done) {
            agent.get('/api/client').expect(401, done)
        });
        it('non admin user should not have access to client route', function(done) {
            agent.post('/api/user/login').send({
                username: 'test',
                password: 'test'
            }).end(function(err, res) {
                should.not.exist(err);
                agent.get('/api/client').expect(401).end(function(err, res) {
                    should.not.exist(err);
                    agent.get('/api/user/logout').expect(200, done)
                });
            });
        });
    });
});