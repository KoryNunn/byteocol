var test = require('tape');
var byteocol = require('../');

var protocol = byteocol({
    doFoo: 'b8:type b8:foo b8:bar b32:baz',
    doBar: 'b8:type b16:dooby b8:dooble b24:whatsits'
});

var fooData = {
        type: 0,
        foo: 1,
        bar: 2,
        baz: 3
    };

var barData = {
        type: 0,
        dooby: 37568,
        dooble: 2,
        whatsits: 95738
    };

test('foo', function(t){
    t.plan(2);
    var fooPacket = protocol.serialize('doFoo', fooData);
    t.deepEqual(fooPacket.toJSON(), new Buffer([0x00,0x01,0x02,0x00,0x00,0x00,0x03]).toJSON());
    var parsedFooPacket = protocol.parse('doFoo', fooPacket);
    t.deepEqual(parsedFooPacket, fooData);
});

test('bar', function(t){
    t.plan(2);
    var barPacket = protocol.serialize('doBar', barData);
    t.deepEqual(barPacket.toJSON(), new Buffer([0x00,0x92,0xc0,0x02,0x01,0x75,0xfa]).toJSON());
    var parsedBarPacket = protocol.parse('doBar', barPacket);
    t.deepEqual(parsedBarPacket, barData);
});