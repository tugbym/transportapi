var request = require('supertest');
var chai = require('chai').should();
var assert = require('assert');
var mongoose = require('mongoose');
var app = require('../app');
var http = require('http');

describe('Routing', function() {
    var url = "http://fiesta-collect.codio.io:3000";
    before (function(done) {
        var server = http.createServer(app);
        server.listen(3000);
        mongoose.createConnection('mongodb://localhost/transport-api');
        done();
    });
    
    describe('Flights Route', function() {
        
        it('should return 200 response code', function(done) {
            request(url)
                .get('/flight')
                .expect(200, done)
        });
        
        it('should return vnd.collection+json', function(done) {
            request(url)
                .get('/flight')
                .expect('Content-Type', /vnd\.collection\+json/, done)
        });
        
    });
    
    describe('Bus Route', function() {
        
        it('should return 200 response code', function(done) {
            request(url)
                .get('/bus')
                .expect(200, done)
        });
        
        it('should return vnd.collection+json', function(done) {
            request(url)
                .get('/bus')
                .expect('Content-Type', /vnd\.collection\+json/, done)
        });
        
    });
    
    describe('Train Route', function() {
        
        it('should return 200 response code', function(done) {
            request(url)
                .get('/train')
                .expect(200, done)
        });
        
        it('should return vnd.collection+json', function(done) {
            request(url)
                .get('/train')
                .expect('Content-Type', /vnd\.collection\+json/, done)
        });
        
    });
});