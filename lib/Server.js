'use strict';

var dgram = require('dgram'),
    util = require('util'),
    events = require('events'),
    decode = require('./decode');

var Server = function (port, addresses) { var s = this; var a = addresses; events.EventEmitter.call(this); this.port = port; this._sock = dgram.createSocket('udp4'); this._sock.bind(port); this._sock.on('message', function (msg, rinfo) { var d = decode(msg); var f_index = d.map(function (element) {return element[0];}).indexOf(a[0]); if (f_index>-1) s.emit(a[0], d[f_index][2]); var i = a.length; do { i--; var f_index = d.map(function (element) {return element[0];}).indexOf(a[i]); if (f_index>-1) s.emit(a[i], d[f_index][1]); }while(i>1); }); this.kill = function () { this._sock.close(); };};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
