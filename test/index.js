var test = require('tape');
var byteocol = require('../');

var protocol = byteocol({
    doFoo: 'b8:type:int b8:foo:int b8:bar:int b32:baz:int',
    doBar: 'b8:type:int b16:dooby:int b8:dooble:int b32:whatsits:int',
    string: 'b8:type:int l128:data:string',
    justANum: 'b128:number:int'
});

var fooData = {
        type: 0,
        foo: 1,
        bar: 2,
        baz: 3
    };

var barData = {
        type: 0,
        dooby: 128,
        dooble: 2,
        whatsits: 1024
    };

test('foo', function(t){
    t.plan(1);
    var fooPacket = protocol.serialize('doFoo', fooData);
    var parsedFooPacket = protocol.parse('doFoo', fooPacket);
    t.deepEqual(parsedFooPacket, fooData);
});

test('bar', function(t){
    t.plan(1);
    var barPacket = protocol.serialize('doBar', barData);
    var parsedBarPacket = protocol.parse('doBar', barPacket);
    t.deepEqual(parsedBarPacket, barData);
});

test('string', function(t){
    t.plan(1);
    var data = {
            type: 0,
            data: 'Hello world'
        };

    var stringPacket = protocol.serialize('string', data);
    var parsedStringPacket = protocol.parse('string', stringPacket);
    parsedStringPacket.data = parsedStringPacket.data.slice(0, data.data.length);

    t.deepEqual(parsedStringPacket, data);
});

test('manyNumbers', function(t){
    t.plan(1);
    var x = 0;
    while(x++ < 2048){
        var result = protocol.parse('justANum', protocol.serialize('justANum', {number: x}));
        if(result.number !== x){
            t.fail();
        }
    }

    t.pass();

});