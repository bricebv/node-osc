'use strict';

var types = require('./types');

var TInt = types.TInt;
var TFloat = types.TFloat;
var TString = types.TString;
var TBlob = types.TBlob;
var TDouble = types.TDouble;
var TTime = types.TTime;
var ThInt = types.ThInt;
var TFFloat = types.TFFloat;
var False = types.False;
var True = types.True;
var Nil = types.Nil;
var TBigE = types.TBigE;

// for each OSC type tag we use a specific constructor function to decode its respective data
var tagToConstructor = {
    'i': function () { return new TInt(); },
    'f': function () { return new TFloat(); },
    's': function () { return new TString(); },
    'b': function () { return new TBlob(); },
    'd': function () { return new TDouble(); },
    'h': function () { return new ThInt(); },
    'ff': function () { return new TFFloat(); },
    'F': function () { return new False(); },
    'T': function () { return new True(); },
    'N': function () { return new Nil(); },
    'hh': function () { return new TBigE(); }
};

function decode(d){var m=[],a=new TString();d=a.decode(d);if (a.value==='#bundle'){var t=new TTime(),l,p;d=t.decode(d);m.push('#bundle'); m.push(t.value);while(d.length>0){l=new TInt();d=l.decode(d);p=d.slice(0,l.value);m.push(decode(p));d=d.slice(l.value, d.length); } } else if (d.length>0){ m.push(a.value);var tt=new TString();d=tt.decode(d);tt=tt.value;if(tt[0]!==',') throw 'invalid type tag'; tt = tt.substr(1);var constructor=tagToConstructor[tt];if(!constructor) throw 'Unsupported OSC type'; var argument = constructor(); d = argument.decode(d); m.push(argument.value);}return m;}

module.exports = decode;
