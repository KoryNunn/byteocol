var leftPad = require('left-pad');

var typeParsers = {
    int: function(buffer){
        var length = buffer.length,
            index = 0;

        return buffer.reduce(function(result, value){
            result += value * Math.pow(256, length - 1 - index++);
            return result;
        }, 0);
    },
    string: function(buffer){
        return buffer.toString();
    }
};

function parseMessageFormat(messageFormat){
    var parts = messageFormat.split(' ');

    return parts.map(function(part){
        var parts = part.match(/(\w)([0-9]*)\:([^:]*)(?:\:(.*))?/);

        if(!parts){
            throw 'Bad protocol format: ' + messageFormat;
        }

        return {
            endien: parts[1],
            length: parseInt(parts[2]),
            name: parts[3],
            type: parts[4]
        };
    });
}

function parseMessageFormats(messageFormats){
    var result = {};

    for(var key in messageFormats){
        result[key] = parseMessageFormat(messageFormats[key]);
        result[key].size = result[key].reduce(function(result, part){
            return result + part.length;
        }, 0)
    }

    return result;
}

function parse(type, buffer){
    var definition = this[type],
        result = {};

    definition.forEach(function(part){
        result[part.name] = buffer.slice(0, part.length / 8);
        if(part.type){
            result[part.name] = typeParsers[part.type](result[part.name]);
        }
        buffer = buffer.slice(part.length / 8, buffer.length);
    });

    return result;
}

function serialize(type, data){
    var definition = this[type],
        result = Buffer.alloc(definition.size / 8),
        index = 0;

    definition.forEach(function(part){
        var dataValue = data[part.name],
            partLength = part.length / 8,
            partBuffer;

        if(typeof dataValue === 'number'){
            var bits = leftPad(dataValue.toString(2), part.length, 0).split('');
            while(bits.length){
                result[index] = parseInt(bits.splice(0, 8).join(''), 2);
                index++;
            }
            return;
        }else{
            partBuffer = Buffer.from(dataValue);
        }

        var startIndex = part.endien === 'b' ? index + Math.max(0, partLength - partBuffer.length) : index;

        if(partBuffer.length > partLength){
            throw 'Data exceeds available size';
        }

        partBuffer.copy(result, startIndex);

        index += partLength;
    });

    return result;
}

module.exports = function(messageFormats){
    var messageParts = parseMessageFormats(messageFormats);

    return {
        parse: parse.bind(messageParts),
        serialize: serialize.bind(messageParts)
    };
};
module.exports.typeParsers = typeParsers;