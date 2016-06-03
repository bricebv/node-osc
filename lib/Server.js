'use strict';
var dgram = require('dgram'),
    util = require('util'),
    events = require('events'),
    decode = require('./decode');
var Server = function (port, host) {
    var server = this;
    events.EventEmitter.call(this);
    this.port = port;
    this.host = host;
    this._sock = dgram.createSocket('udp4');
    this._sock.bind(port);
    this._sock.on('message', function (msg, rinfo) {
        var decoded = decode(msg);
        if (decoded) server.emit('message', decoded, rinfo);
    });
    this._sock.on('listening', function () {
        var address = server._sock.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });
    this.kill = function () {
        this._sock.close();
    };
};
util.inherits(Server, events.EventEmitter);
module.exports = Server;
