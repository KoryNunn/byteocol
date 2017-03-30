# byteocol

fixed position byte protocol parser/serializer

Horribly prototypical at the moment

## Usage:

```
var byteocol = require('byteocol');

var protocol = byteocol({
    doFoo: 'b8:type b8:foo b8:bar b32:baz',
    ... more named packets
});

var fooData = {
        type: 0,
        foo: 1,
        bar: 2,
        baz: 3
    };

var fooPacket = protocol.serialize('doFoo', fooData);

// fooPacket -> <Buffer 00 01 02 00 00 00 03>

var parsed = protocol.parse('doFoo', fooPacket);

// parsed -> { type: 0, foo: 1, bar: 2, baz: 3 }
```