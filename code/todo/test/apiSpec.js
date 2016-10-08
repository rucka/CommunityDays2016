var request = require('supertest');
var should = require("should");

describe("api", function() {
    describe("GET /api/ping", function () {
        it("respond 'pong!'", function (done) {
            var app = require('express')();
            var api = require("../lib/api");
            api.configure(app);
            request(app).
            get('/api/ping').
            expect(200, 'pong!', done);
        });
    });
    describe("GET /api/", function () {
        it("returns all todo items", function (done) {
            var db = require("../lib/memory");
            createTwoDummyItems(db, function () {
                var app = require('express')();
                var api = require("../lib/api");
                api.configure(app, db);
                request(app).
                get('/api/').
                set('accept', 'application/json').
                expect(200).
                expect('Content-Type', /json/).
                end(function(err, res) {
                    if (err) return done(err);
                    var todos = res.body;
                    todos[0].title.should.be.equal('todo1');
                    todos[1].title.should.be.equal('todo2');
                    done();
                });    
            });
        });
    });
    describe("GET /api/:id", function () {
        it("returns specific todo item", function (done) {
            var db = require("../lib/memory");
            createTwoDummyItems(db, function () {
                var app = require('express')();
                var api = require("../lib/api");
                api.configure(app, db);
                request(app).
                get('/api/2').
                set('accept', 'application/json').
                expect(200).
                expect('Content-Type', /json/).
                end(function(err, res) {
                    if (err) return done(err);
                    var todo = res.body;
                    todo.title.should.be.equal('todo2');
                    done();
                });    
            });
        });
    }); 

    function createTwoDummyItems (db, cb) {
         db.create('todo1', 1, function () {
            db.create('todo2', 2, cb);
        });
    }     
});