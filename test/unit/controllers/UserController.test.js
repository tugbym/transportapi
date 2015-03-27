var request = require('supertest');
var agent = request.agent('http://localhost:3000');
var should = require('chai').should();

describe('User Route', function() {
    
    before(function(done) {
        Bus.create({
            arrivalTime: '01/01/01 01:01',
            departureTime: '01/01/01 11:11',
            latitude: '56.75',
            longitude: '45.35'
        }).exec(function() {});
        Train.create({
            arrivalTime: '01/01/01 01:01',
            departureTime: '01/01/01 11:11',
            latitude: '56.75',
            longitude: '45.35'
        }).exec(function() {});
        Flight.create({
            arrivalTime: '01/01/01 01:01',
            departureTime: '01/01/01 11:11',
            latitude: '56.75',
            longitude: '45.35'
        }).exec(function() {});
        agent.post('/api/user').send({
            username: 'friendTest',
            password: 'friendTest',
            bday: '01/01/01 01:01',
            email: 'test@example.com'
        }).expect(201, done)
    });
    
    after(function(done) {
        Bus.destroy({
            latitude: '56.75'
        }).exec(function() {});
        Train.destroy({
            latitude: '56.75'
        }).exec(function() {});
        Flight.destroy({
            latitude: '56.75'
        }).exec(function() {});
        agent.post('/api/user/login').send({
            username: 'mocha',
            password: 'testing'
        }).expect(200).end(function(err, res) {
            should.not.exist(err);
            agent.delete('/api/user').expect(200, done)
        });
    });
    
    it('post with invalid data should return 500 response code', function(done) {
        agent.post('/api/user').send({
            invalid: 'invalid'
        }).expect(500, done)
    });
    
    it('post with valid data should return 201 response code', function(done) {
        agent.post('/api/user').send({
            username: 'mocha',
            password: 'testing',
            bday: '01/01/01 01:01',
            email: 'test@example.com'
        }).expect(201, done)
    });
    
    it('new user should now exist', function(done) {
        agent.post('/api/user/login').send({
            username: 'mocha',
            password: 'testing'
        }).expect(200, done)
    });
    
    it('get should return 200 response code', function(done) {
        agent.get('/api/user').expect(200, done)
    });
    
    it('post valid search should return 200 response code', function(done) {
        agent.post('/api/user/search').send({
            search: 'admin',
            searchBy: 'nickname'
        }).expect(200, done)
    });
    
    it('get with invalid id should return 404 response code', function(done) {
        agent.get('/api/user/123').expect(404, done)
    });
    
    it('get with valid id should return 200 response code', function(done) {
        agent.post('/api/user/search').send({
            search: 'admin',
            searchBy: 'nickname'
        }).end(function(err, res) {
            should.not.exist(err);
            var json = JSON.parse(res.text);
            json = json.collection.items[0].data;
            var userID;
            for(var i = 0; i < json.length; i++) {
                if(json[i].name == 'id') {
                    userID = json[i].value;
                }
            }
            agent.get('/api/user/' + userID).expect(200, done)
        });
    });
    
    it('put with invalid data should return 400 response code', function(done) {
        agent.put('/api/user').send({
            invalid: 'invalid'
        }).expect(400, done)
    })
    
    it('put with valid data and valid id should return 200 response code', function(done) {
        agent.put('/api/user').send({
            name: 'Testing'
        }).expect(200, done)
    });
    
    describe('Adding a Friend', function() {
        
        it('put with invalid friend name should return 404 response code', function(done) {
            agent.put('/api/user/friends/unknown').expect(404, done)
        });
        
        it('put with valid friend name should return 200 response code', function(done) {
            agent.put('/api/user/friends/friendTest').expect(200, done)
        });
        
        it('should not be a mutual friend', function(done) {
            Users.findOne({
                nickname: 'mocha'
            }).exec(function(err, doc) {
                var mutual = doc.friends[0].mutual;
                mutual.should.equal(false);
                done();
            });
        });
        
        it('put with added friend should return 200 response code', function(done) {
            agent.post('/api/user/login').send({
                username: 'friendTest',
                password: 'friendTest'
            }).expect(200).end(function(err, res) {
                should.not.exist(err);
                agent.put('/api/user/friends/mocha').expect(200, done)
            });
        });
        
        it('should now be a mutual friend', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links[0];
                should.exist(json.rel);
                json.rel.should.equal('friend');
                done();
            });
        });
        
        it('delete with invalid friend name should return 404 response code', function(done) {
            agent.delete('/api/user/friends/unknown').expect(404, done)
        });
        
        it('delete with valid friend name should return 200 response code', function(done) {
            agent.delete('/api/user/friends/mocha').expect(200, done)
        });
        
        it('should not show on profile anymore', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links;
                should.not.exist(json[0]);
                done();
            });
        });
        
        it('should no longer be mutual on other profile', function(done) {
            Users.findOne({
                nickname: 'mocha'
            }).exec(function(err, doc) {
                var mutual = doc.friends[0].mutual;
                mutual.should.equal(false);
                done();
            });
        });
        
    });
    
    describe('Adding a Bus', function() {
        
        it('put with invalid bus id should return 404 response code', function(done) {
            agent.put('/api/user/bus/123').expect(404, done)
        });
        
        it('put with valid bus id should return 200 response code', function(done) {
            Bus.findOne({
                latitude: '56.75'
            }).exec(function(err, bus) {
                should.not.exist(err);
                var id = bus.id;
                agent.put('/api/user/bus/' + id).expect(200, done)
            });
        });
        
        it('should have added bus link to user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links[0];
                should.exist(json.rel);
                json.rel.should.equal('item');
                done();
            });
        });
        
        it('delete with invalid bus id should return 404 response code', function(done) {
            agent.delete('/api/user/bus/123').expect(404, done)
        });
        
        it('delete with valid bus id should return 200 response code', function(done) {
            Bus.findOne({
                latitude: '56.75'
            }).exec(function(err, bus) {
                should.not.exist(err);
                var id = bus.id;
                agent.delete('/api/user/bus/' + id).expect(200, done)
            });
        });
        
        it('bus link should no longer appear on user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links;
                should.not.exist(json[0]);
                done();
            });
        });
        
    });
    
    describe('Adding a Train', function() {
        
        it('put with invalid train id should return 404 response code', function(done) {
            agent.put('/api/train/bus/123').expect(404, done)
        });
        
        it('put with valid train id should return 200 response code', function(done) {
            Train.findOne({
                latitude: '56.75'
            }).exec(function(err, train) {
                should.not.exist(err);
                var id = train.id;
                agent.put('/api/user/train/' + id).expect(200, done)
            });
        });
        
        it('should have added train link to user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links[0];
                should.exist(json.rel);
                json.rel.should.equal('item');
                done();
            });
        });
        
        it('delete with invalid train id should return 404 response code', function(done) {
            agent.delete('/api/user/train/123').expect(404, done)
        });
        
        it('delete with valid train id should return 200 response code', function(done) {
            Train.findOne({
                latitude: '56.75'
            }).exec(function(err, train) {
                should.not.exist(err);
                var id = train.id;
                agent.delete('/api/user/train/' + id).expect(200, done)
            });
        });
        
        it('train link should no longer appear on user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links;
                should.not.exist(json[0]);
                done();
            });
        });
        
    });
    
    describe('Adding a Flight', function() {
        
        it('put with invalid flight id should return 404 response code', function(done) {
            agent.put('/api/user/flight/123').expect(404, done)
        });
        
        it('put with valid flight id should return 200 response code', function(done) {
            Flight.findOne({
                latitude: '56.75'
            }).exec(function(err, flight) {
                should.not.exist(err);
                var id = flight.id;
                agent.put('/api/user/flight/' + id).expect(200, done)
            });
        });
        
        it('should have added flight link to user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links[0];
                should.exist(json.rel);
                json.rel.should.equal('item');
                done();
            });
        });
        
        it('delete with invalid flight id should return 404 response code', function(done) {
            agent.delete('/api/user/flight/123').expect(404, done)
        });
        
        it('delete with valid flight id should return 200 response code', function(done) {
            Flight.findOne({
                latitude: '56.75'
            }).exec(function(err, flight) {
                should.not.exist(err);
                var id = flight.id;
                agent.delete('/api/user/flight/' + id).expect(200, done)
            });
        });
        
        it('flight link should no longer appear on user profile', function(done) {
            agent.get('/api/user').expect(200).end(function(err, res) {
                should.not.exist(err);
                var json = JSON.parse(res.text);
                json = json.collection.items[0].links;
                should.not.exist(json[0]);
                done();
            });
        });
        
        it('delete with valid id should return 200 response code', function(done) {
            agent.delete('/api/user').expect(200, done)
        });
        
    });
    
});