// var assert = require('assert');
// var glob = require('glob');
var url = require('url');
var path = require('path');
var fs = require('fs');
// var debug = require('debug')('rets.js:test:integration');
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

var config_path = process.env.CONFIG_PATH || path.join(__dirname, './config.json');

var server = require(config_path);
    server.parsed = url.parse(server.config.url);
var instance = new RETS(server.config);

        var fixture = path.join(__dirname, 'fixtures') + '/' + server.parsed.host + '.json';
describe('Integration against: ' + instance.session.url.host, function(){

    this.timeout(30000);

    it('Can login', function(done){
        instance.on('login', done).login(function(/*err, response, body*/){
            // console.log(body);
        });
    });

    it.skip('Can read capabilities from the server', function(){
        // console.log(instance.session.capabilities);
        // assert(instance.session.capabilities.Search && instance.session.capabilities.GetMetadata);
    });


    it.skip('Can get resources',function(done){
        instance.on('medata', done);
        instance.getMetadata({ Type:'METADATA-RESOURCE', ID: server.metadata.resources.ID });
    });
    it.skip('Can get classes',function(done){
        instance.on('medata', done);
        instance.getMetadata({ Type:'METADATA-CLASS', ID: server.metadata.classes.ID });
    });

    it.skip('Can get fields',function(done){
        instance.on('medata', done);
        instance.getMetadata({ Type:'METADATA-TABLE', ID: server.metadata.fields.ID });
    });

    it.skip('Can get status values',function(done){
        instance.on('medata', done);
        instance.getMetadata({ Type:'METADATA-LOOKUP_TYPE', ID: server.metadata.status.ID });
    });

    it('Can get metadata as a native object');
    it('Can stream metadata to an xml file');
    it('Can search for property listings');
    it('Can send raw stream to an xml file');
    it('Can send a csv stream to a csv file');
    it('Can get stream of objects');
    it('Can get stream of arrays');
    it('Can get object from the server: NOT IMPLEMENTED');

    it.skip('Can search for property listings', function(done){
        instance.on('search', done);
        instance.search(server.search);
    });

    it.skip('Can logout', function(done){
        instance.on('logout', done).logout();
    });

});
