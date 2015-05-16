/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = Parser;

/** log facility */
var debug = require('debug')('rets.js:parser');

/** core deps */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var sax = require('sax');

var RETSError = require("./error");

var CRLF = "\n";

var tags = {
    "COLUMNS": {
        parse: function(body) {
            debug('parsing %s', this.tag.name);
            this.columns = body.trim().split(this.delimiter);

            if (this.options.objectMode) {
                this.emit('columns',this.columns);
            } else if (this.options.format === 'csv') {
                this.emit('columns',body + CRLF);
            } else {
                this.emit('columns',JSON.stringify(this.columns) + CRLF);
            }
        }
    },
    "COUNT": {
        open: function(tagName, tag) {
            this.emit('count', tag.attributes.RECORDS);
        }
    },
    "DATA": {
        parse: function(body) {
            debug('parsing %s', this.tag.name);

            var cleantext = body.replace(/^\t/,'').replace(/\t$/,'');
            var record = null;

            if (this.options.format === 'objects') {
                var values = cleantext.split(this.delimiter);
                record = {};
                this.columns.forEach(function(column,index){
                    record[column] = values[index];
                });

                if (this.options.objectMode) {
                    this.emit('data',record);
                } else {
                    this.emit('data',JSON.stringify(record) + CRLF);
                }

            } else if (this.options.format === 'arrays') {
                if (this.options.objectMode) {
                    this.emit('data',cleantext.split(this.delimiter));
                } else {
                    this.emit('data',JSON.stringify(cleantext.split(this.delimiter)) + CRLF);
                }
            } else if (this.options.format === 'csv') {
                var linebreak = /.*([\n\r\"\,]*).*/g;
                record = cleantext.split(this.delimiter).map(function(value){
                    if (linebreak.test(value)) {
                        return '"' + value + '"';
                    } else {
                        return value;
                    }
                }).join(this.delimiter);

                this.emit('data',record + CRLF);
            }
            this.records++;
        }
    },
    "DELIMITER": {
        open: function(tagName, tag) {
            this.emit('delimiter', String.fromCharCode(parseInt(tag.attributes.VALUE)));
        }
    },
    "MAXROWS": {
        open: function() {
            this.emit('maxrows');
        }
    },
    "RETS": {
        open: function(tagName, tag) {
            // this.parseStatus(tag);
            this.emit('status', {
                code: tag.attributes.REPLYCODE,
                message: tag.attributes.REPLYTEXT
            });
            if (tag.attributes.REPLYCODE !== '0') {
                this.emit('error', new RETSError(tag.attributes.REPLYCODE, tag.attributes.REPLYTEXT));
            }
        }
    },
    "RETS-RESPONSE": {
        parse: function(body) {
            debug('parsing %s', this.tag.name);
            /**
             * key-value-body
             * ::= <RETS-RESPONSE>CRLF
             * *(key = value CRLF)
             *  </RETS-RESPONSE>
             */
            var lines = body.trim().split("\n");
            var $this = this;
            lines.forEach(function(line){
                var split   =  line.split( '=' );
                var key     =  split[0].replace(/^\s+|\s+$/g, '' );
                var value   =  split[1].replace(/^\s+|\s+$/g, '' );
                if (/^\//.test(value)) { //todo: test for FQDN URLs vs site-root relative links
                    $this.emit('capability', key, value);
                } else {
                    $this.emit('setting', key, value);
                }
            });
        }
    },
    "RETS-STATUS": {
        open: function(tagName, tag) {
            // this.parseStatus(tag);
            this.emit('status', {
                code: tag.attributes.REPLYCODE,
                message: tag.attributes.REPLYTEXT
            });
            if (tag.attributes.REPLYCODE !== '0') {
                this.emit('error', new RETSError(tag.attributes.REPLYCODE, tag.attributes.REPLYTEXT));
            }
        }
    }
};

util.inherits(Parser,EventEmitter);
function Parser(options){

    var $this = this;

    this.callback = function noop(){};
    this.previous = null;
    this.tag = null;

    this.options = options;

    /**
     * The record count returned by the server
     * @member {Number} count - the record count returned by the server
     */
    this.count = 0;

    /**
     * The number of records processed
     * @member {Number} records - the total records processed
     */
    this.records = 0;

    this.columns = [];

    // Seting the default value this way since that's what a RETS
    // server will typically send back: '09'
    this.delimiter = String.fromCharCode(9);

    // We definitely don't want to lose whitespace;
    this.xml = sax.createStream(false, {trim:false});

    this.xml.onopentag = function(tag) {
        $this.previous = $this.tag;
        $this.tag = tag;
        if (typeof tags[tag.name] !== 'undefined' && typeof tags[tag.name].open === 'function') {
            debug('Parsing opening tag %s', tag.name);
            tags[tag.name].open.call($this, tag.name, tag);
        }
    };

    this.xml.onclosetag = function(tagName) {
        if (typeof tags[tagName] !== 'undefined' && typeof tags[tagName].close === 'function') {
            tags[tagName].close.call($this);
        }
        $this.tag = $this.previous;
        $this.previous = null;
        $this.callback();
    };

    this.xml.ontext = function(body) {
        if (typeof tags[$this.tag.name] !== 'undefined' && typeof tags[$this.tag.name].parse === 'function') {
            tags[$this.tag.name].parse.call($this, body);
        }
    };

    this.xml.onend = function() {
        $this.tag = null;
    };

    this.xml.onerror = function(err) {
        $this.emit('error', err);
        $this.xml.error = null;
        $this.xml.resume();
    };

    EventEmitter.call(this);
}

Parser.prototype.write = function(chunk, callback) {
    if (typeof callback === 'function') {
        this.callback = callback;
    }
    this.xml.write(chunk);
};
