// var assert = require('assert');
// var util = require('util');
// var debug = require('debug')('rets.js:test:servers:mock');
// var fs = require('fs');
var nock = require('nock');
// var xml = require('xml2js').parseString;
// var glob = require('glob');
var path = require('path');
var RETS = require('../');
// var debug = require('debug')('rets.js:mock-server');

// var fixtures = './test/servers/fixtures';
// var outputs = './test/tmp';

// if (!fs.existsSync(outputs)) {
//     fs.mkdirSync(outputs);
// }
//
// function testStream(file) {
//     return fs.createWriteStream(outputs + '/' + file);
// }
//
// function getTestOutput(file) {
//     return fs.readFileSync(outputs + '/' + file);
// }

describe('Mocked RETS Server calls',function(){

    // this.timeout(10000);

    var rets = null;

    before(function(){
        nock.load(path.join(__dirname, 'fixtures.json'));
        rets = new RETS({url: "https://user:pass@example.com:9160/contact/rets/login"});
    });

    it.only('Can login to a RETS server',function(done){

        rets.on('login', function(){
            done();
        });

        rets.on('error', function(err){
            done(err);
        });

        rets.login();

    });

    // it('Can read capabilities from the server',function(){
    //     assert(rets.session.capabilities.Search && rets.session.capabilities.GetMetadata);
    // });

    // it('Can get metadata as a native object',function(done){
    //
    //     loadFixture('metadata-resource');
    //     rets.addListener('metadata',function(err, result){
    //         rets.removeAllListeners('metadata');
    //         assert(err === null);
    //         assert(typeof result === 'object');
    //     });
    //
    //     rets.getMetadata({ Type:'METADATA-RESOURCE', ID: '0'})
    //     .on('finish', function(){
    //         done();
    //     });
    // });

    // it('Can stream metadata to an xml file',function(done){
    //
    //     loadFixture('metadata-resource');
    //     rets.addListener('metadata',function(err, result){
    //         rets.removeAllListeners('metadata');
    //         assert(err === null);
    //         assert(typeof result === 'object');
    //
    //         var results = getTestOutput('metadata.xml');
    //         xml(results, function(parserr){
    //             assert(parserr === null);
    //             done();
    //         });
    //
    //     });
    //
    //     rets.getMetadata({ Type:'METADATA-RESOURCE', ID: '0'})
    //     .pipe(testStream('metadata.xml'))
    //     .on('finish', function(){
    //         // done(); we will wait until we have validated the final result
    //     });
    // });

    // it('Can search for property listings',function(done){
    //
    //     loadFixture('search');
    //     rets.addListener('search',function(err, res){
    //         rets.removeAllListeners('search');
    //         assert(err === null);
    //         assert(res.count !== null);
    //         assert(res.records !== null);
    //     });
    //
    //     rets.search({
    //         SearchType: 'Property',
    //         Class: 'Residential',
    //         Query: '(TimestampModified=2015-04-01+),(Status=|A)',
    //         QueryType: 'DMQL2',
    //         Offset:1,
    //         Limit: 3,
    //         StandardNames: 1
    //     })
    //     .on('finish', function(){
    //         done();
    //     });
    // });

    // it('Can send raw stream to an xml file',function(done){
    //
    //     loadFixture('search');
    //     rets.addListener('search',function(err, res){
    //         rets.removeAllListeners('search');
    //         assert(err === null);
    //         assert(res.count !== null);
    //         assert(res.records !== null);
    //
    //         var results = getTestOutput('listings-raw.xml');
    //         xml(results, function(parserr){
    //             assert(parserr === null);
    //             done();
    //         });
    //
    //     });
    //
    //     rets.search({
    //         SearchType: 'Property',
    //         Class: 'Residential',
    //         Query: '(TimestampModified=2015-04-01+),(Status=|A)',
    //         QueryType: 'DMQL2',
    //         Offset:1,
    //         Limit: 3,
    //         StandardNames: 1
    //     })
    //     .raw.pipe(testStream('listings-raw.xml'))
    //     .on('finish', function(){
    //         // done(); we will wait until we have validated the final result
    //     });
    // });

    // it('Can send a csv stream to a csv file',function(done){
    //
    //     loadFixture('search');
    //     rets.addListener('search',function(err, res){
    //         rets.removeAllListeners('search');
    //         assert(err === null);
    //         assert(res.count !== null);
    //         assert(res.records !== null);
    //     });
    //
    //     rets.search({
    //         SearchType: 'Property',
    //         Class: 'Residential',
    //         Query: '(TimestampModified=2015-04-01+),(Status=|A)',
    //         QueryType: 'DMQL2',
    //         Offset:1,
    //         Limit: 3,
    //         StandardNames: 1,
    //         objectMode: false,
    //         format: 'csv',
    //     })
    //     .pipe(testStream('listings.csv'))
    //     .on('finish', function(){
    //         done();
    //     });
    // });

    // it('Can get stream of objects',function(done){
    //
    //     loadFixture('search');
    //     rets.addListener('search',function(err, res){
    //         rets.removeAllListeners('search');
    //         assert(err === null);
    //         assert(res.count !== null);
    //         assert(res.records !== null);
    //     });
    //
    //     rets.search({
    //         SearchType: 'Property',
    //         Class: 'Residential',
    //         Query: '(TimestampModified=2015-04-01+),(Status=|A)',
    //         QueryType: 'DMQL2',
    //         Offset:1,
    //         Limit: 3,
    //         StandardNames: 1,
    //         objectMode: true,
    //         format: 'objects',
    //     })
    //     .on('data', function(record){
    //         assert(typeof record === 'object');
    //     })
    //     .on('finish', function(){
    //         done();
    //     });
    // });

    // it('Can get stream of arrays',function(done){
    //
    //     loadFixture('search');
    //     rets.removeAllListeners('search');
    //
    //     rets.search({
    //         SearchType: 'Property',
    //         Class: 'Residential',
    //         Query: '(TimestampModified=2015-04-01+),(Status=|A)',
    //         QueryType: 'DMQL2',
    //         Offset: 1,
    //         Limit: 3,
    //         StandardNames: 1,
    //         objectMode: true,
    //         format: 'arrays',
    //     })
    //     .on('data', function(record){
    //         assert(record instanceof Array && record.length);
    //     })
    //     .on('finish', function(){
    //         done();
    //     });
    // });

    // it('Can get object from the server: NOT IMPLEMENTED',function(done){
    //
    //     var timeout = setTimeout(function(){
    //         rets.removeAllListeners('object');
    //         assert(false, 'No event fired');
    //         done();
    //     },1000);
    //
    //     rets.addListener('object',function(err){
    //         rets.removeAllListeners('object');
    //         clearTimeout(timeout);
    //         assert(err.message === 'Not implemented');
    //         done();
    //     });
    //
    //     rets.getObject();
    // });

    // it('Can logout of a RETS server',function(done){
    //
    //     loadFixture('logout');
    //     var _timeout = setTimeout(function(){
    //         rets.removeAllListeners('logout');
    //         assert(false, 'No event fired');
    //         done();
    //     },1000);
    //
    //     rets.addListener('logout',function(err){
    //         rets.removeAllListeners('logout');
    //         clearTimeout(_timeout);
    //         assert(err === null);
    //         done();
    //     });
    //
    //     rets.logout();
    // });

});
