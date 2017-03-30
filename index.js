var leftPad = require('left-pad');

function parseMessageFormat(messageFormat){
    var parts = messageFormat.split(' ');

    return parts.map(function(part){
        var parts = part.match(/(\w)([0-9]*)\:(.*)/);

        if(!parts){
            throw 'Bad protocol format: ' + messageFormat;
        }

        return {
            endien: parts[1],
            length: parseInt(parts[2]),
            name: parts[3]
        };
    });
}

function parseMessageFormats(messageFormats){
    var result = {};

    for(var key in messageFormats){
        result[key] = parseMessageFormat(messageFormats[key]);
    }

    return result;
}

function parse(type, buffer){
    var definition = this[type],
        result = {};

    definition.forEach(function(part){
        result[part.name] = buffer.readUIntBE(0, part.length / 8);
        buffer = buffer.slice(part.length / 8, buffer.length);
    });

    return result;
}

function serialize(type, data){
    var definition = this[type],
        bits = definition.map(function(part){
            return leftPad(data[part.name].toString(2), part.length, 0);
        }).join('');

    var bytes = [];

    while(bits.length){
        bytes.push(parseInt(bits.slice(0, 8), 2));
        bits = bits.slice(8);
    }

    result = new Buffer(bytes);

    return result;
}

module.exports = function(messageFormats){
    var messageParts = parseMessageFormats(messageFormats);

    return {
        parse: parse.bind(messageParts),
        serialize: serialize.bind(messageParts)
    };
};