'use strict';

var jspack = require('jspack').jspack;

var pack = jspack.packTo;

function ShortBuffer(type, buf, requiredLength)
{
    this.type = 'ShortBuffer';
    var message = 'buffer [';
    for (var i = 0; i < buf.length; i++) {
        if (i) {
            message += ', ';
        }
        message += buf.charCodeAt(i);
    }
    message += '] too short for ' + type + ', ' + requiredLength + ' bytes required';
    this.message = message;
}

function TString (value) { this.value = value; }

TString.prototype = {
    typetag: 's',
    decode: function (data) {
        var end = 0;
        while (data[end] && end < data.length) {
            end++;
        }
        if (end === data.length) {
            throw Error('OSC string not null terminated');
        }
        this.value = data.toString('ascii', 0, end);
        var nextData = parseInt(Math.ceil((end + 1) / 4.0) * 4);
        return data.slice(nextData);
    },
    encode: function (buf, pos) {
        var len = Math.ceil((this.value.length + 1) / 4.0) * 4;
        return pack('>' + len + 's', buf, pos, [ this.value ]);
    }
};

exports.TString = TString;

function TInt (value) { this.value = value; }

TInt.prototype = {
    typetag: 'i',
    decode: function (data) {
        if (data.length < 4) {
            throw new ShortBuffer('int', data, 4);
        }

        this.value = jspack.Unpack('>i', data.slice(0, 4))[0];
        return data.slice(4);
    },
    encode: function (buf, pos) {
        return pack('>i', buf, pos, [ this.value ]);
    }
};

exports.TInt = TInt;

function ThInt (value) { this.value = value; }
ThInt.prototype = {
    typetag: 'h',
    decode: function (data) {
        if (data.length < 4) {
            throw new ShortBuffer('int', data, 4);
        }

        this.value = jspack.Unpack('>i', data.slice(0, 4))[0];
        return data.slice(4);
    },
    encode: function (buf, pos) {
        return jspack.PackTo('>i', buf, pos, [ this.value ]);
    }
}
exports.ThInt = ThInt;

function TTime (value) { this.value = value; }

TTime.prototype = {
    typetag: 't',
    decode: function (data) {
        if (data.length < 8) {
            throw new ShortBuffer('time', data, 8);
        }
        var raw = jspack.Unpack('>LL', data.slice(0, 8));
        var secs = raw[0];
        var fracs = raw[1];
        this.value = secs + fracs / 4294967296;
        return data.slice(8);
    },
    encode: function (buf, pos) {
        return pack('>LL', buf, pos, this.value);
    }
};

exports.TTime = TTime;

function TFloat (value) { this.value = value; }
TFloat.prototype = {
    typetag: 'f',
    decode: function (data) {
        if (data.length < 4) {
            throw new ShortBuffer('float', data, 4);
        }

        this.value = jspack.Unpack('>f', data.slice(0, 4))[0];
        return data.slice(4);
    },
    encode: function (buf, pos) {
        return pack('>f', buf, pos, [ this.value ]);
    }
};

exports.TFloat = TFloat;

function TFFloat (value) { this.value = value; }
TFFloat.prototype = {
    typetag: 'ff',
    decode: function (data) {
        if (data.length < 4) {
            throw new ShortBuffer('float', data, 4);
        }

        this.value = jspack.Unpack('>f', data.slice(0, 4))[0];
        return data.slice(4);
    },
    encode: function (buf, pos) {
        return jspack.PackTo('>f', buf, pos, [ this.value ]);
    }
}
exports.TFFloat = TFFloat;

function TBlob (value) { this.value = value; }
TBlob.prototype = {
    typetag: 'b',
    decode: function (data) {
        var length = jspack.Unpack('>i', data.slice(0, 4))[0];
        var nextData = parseInt(Math.ceil((length) / 4.0) * 4) + 4;
        this.value = data.slice(4, length + 4);
        return data.slice(nextData);
    },
    encode: function (buf, pos) {
        var len = Math.ceil((this.value.length) / 4.0) * 4;
        return pack('>i' + len + 's', buf, pos, [len, this.value]);
    }
};

exports.TBlob = TBlob;

function TDouble (value) { this.value = value; }
TDouble.prototype = {
    typetag: 'd',
    decode: function (data) {
        if (data.length < 8) {
            throw new ShortBuffer('double', data, 8);
        }
        this.value = jspack.Unpack('>d', data.slice(0, 8))[0];
        return data.slice(8);
    },
    encode: function (buf, pos) {
        return pack('>d', buf, pos, [ this.value ]);
    }
};

exports.TDouble = TDouble;

function True (value) { this.value = value; }
True.prototype = {
    typetag: 'T',
    decode: function (data) {
        this.value = true;
        return true;
    }
}
exports.True = True;

function False (value) { this.value = value; }
False.prototype = {
    typetag: 'F',
    decode: function (data) {
        this.value = false;
        return true;
    }
}
exports.False = False;

function Nil (value) { this.value = value; }
Nil.prototype = {
    typetag: 'N',
    decode: function (data) {
        this.value = 'Nil';
        return true;
    }
}
exports.Nil = Nil;

function TBigE (value) { this.value = value; }
TBigE.prototype = {
    typetag: 'hh',
    decode: function (data) {
        if (data.length < 4) {
            throw new ShortBuffer('int', data, 4);
        }

        this.value = jspack.Unpack('>i', data.slice(0, 4))[0];
        return data.slice(4);
    },
    encode: function (buf, pos) {
        return jspack.PackTo('>i', buf, pos, [ this.value ]);
    }
}
exports.TBigE = TBigE;
