// var assert = require('assert');
// var glob = require('glob');
var url = require('url');
var path = require('path');
var fs = require('fs');
// var debug = require('debug')('rets.js:test:servers:live');
var nock = require('nock');

var RETS = require('../');

var record = process.env.RECORD === 'true';

if (record) {
    nock.recorder.clear();
    nock.recorder.rec({
        dont_print: true,
        output_objects: true
    });
}

var servers = require('./config.json');

servers.forEach(function(server){

    server.parsed = url.parse(server.config.url);

    describe('Testing: ' + server.parsed.host, function(){

        var instance = new RETS(server.config);
        var fixture = path.join(__dirname, 'fixtures') + '/' + server.parsed.host + '.json';
        this.timeout(15000);

        before("Server Tests Setup", function(done){
            if (record && fs.existsSync(fixture) && server.parsed.host !== 'rets.server.com:9160') {
                fs.unlink(fixture, function(){
                    done();
                });
            } else {
                if (fs.existsSync(fixture)) {
                    nock.load(fixture);
                }
                done();
            }

        });

        after("Server Test Cleanup", function(done){
            if (record && server.parsed.host !== 'rets.server.com:9160') {
                fs.writeFile(fixture, JSON.stringify(nock.recorder.play(), null, 4), function(){
                    // nock.recorder.restore();
                    done();
                });
            } else {
                done();
            }
        });

        it('Can login', function(done){

            instance.on('login', done).login(function(err, response, body){
                console.log(body);
            });
        });

        it.skip('Can read capabilities from the server', function(){
            console.log(instance.session.capabilities);
            // assert(instance.session.capabilities.Search && instance.session.capabilities.GetMetadata);
        });


        if (typeof server.metadata !== 'undefined') {
            describe.skip('Metadata', function(){
                var metadata = '';
                this.timeout(30000);
                it('Can get resources',function(done){
                    instance.on('medata', done);
                    instance.getMetadata({ Type:'METADATA-RESOURCE', ID: server.metadata.resources.ID }).on('data',function(line){
                        metadata += line.toString();
                    });
                });
                it('Can get classes',function(done){
                    instance.on('medata', done);
                    instance.getMetadata({ Type:'METADATA-CLASS', ID: server.metadata.classes.ID }).on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get fields',function(done){
                    instance.on('medata', done);
                    instance.getMetadata({ Type:'METADATA-TABLE', ID: server.metadata.fields.ID }).on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get status values',function(done){
                    instance.on('medata', done);
                    instance.getMetadata({ Type:'METADATA-LOOKUP_TYPE', ID: server.metadata.status.ID }).on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get metadata as a native object');
                it('Can stream metadata to an xml file');
                it('Can search for property listings');
                it('Can send raw stream to an xml file');
                it('Can send a csv stream to a csv file');
                it('Can get stream of objects');
                it('Can get stream of arrays');
                it('Can get object from the server: NOT IMPLEMENTED');

            });
        }

        if (server.search) {
            describe.skip('Search', function(){
                var search = '';
                this.timeout(30000);
                it('Can search for property listings', function(done){
                    instance.on('search', done);
                    instance.search(server.search).on('data',function(line){
                        search += line.toString();
                    });
                });
            });
        }

        it.skip('Can logout', function(done){
            instance.on('logout', done).logout();
        });

    });

});
