var request = require('supertest');
var chai = require('chai').should();
var assert = require('assert');
var mongoose = require('mongoose');
var server = require('../bin/www');

describe('Routing', function() {
    var url = "http://fiesta-collect.codio.io:3000";
    
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
});