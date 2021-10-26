# alpha-sortable
[![NPM version][npm-image]][npm-url]

Encode/decode numbers in strings so that they sort properly

## Why?

* Because sometimes you want items sorted in numeric order, even though they are sorted on a text field.  Example: filenames.
* Zero padding only works if your users are okay with lots of zeros, and/or you know your numbers will never get large.

## How?

1. Zero-pad to a reasonable amount -- like how big you think things will *probably* get in the life of the system
2. When you get bigger numbers, prefix them with a flagged length that keeps them sorting properly. The flag is an 'E' for every digit in the length counter, followed by the length counter, followed by a hyphen.

A few examples (more below):

|Number|Encoded {length: 4}|
|------|-------|
|1|0001|
|10|0010|
|100|0100|
|1000|1000|
|10000|E5-10000|
|1000000000|EE10-1000000000|

## API

```js
import {stringify, parse} from 'alpha-sortable'

console.log(stringify(20))
// => 0020

console.log(stringify(20, {length: 2}))
// => 20

console.log(stringify(20000000))
// => E8-20000000

console.log(parse('E8-20000000') === 20000000)
// true
```

## More Examples

Here's the full output of demo-table.js :
|Number|BigInt|encoded {length: 4}|
|------|------|-------|
|0|0n|0000|
|1|1n|0001|
|9|9n|0009|
|10|10n|0010|
|99|99n|0099|
|100|100n|0100|
|999|999n|0999|
|1000|1000n|1000|
|9999|9999n|9999|
|10000|10000n|E5-10000|
|99999|99999n|E5-99999|
|100000|100000n|E6-100000|
|999999|999999n|E6-999999|
|1000000|1000000n|E7-1000000|
|9999999|9999999n|E7-9999999|
|10000000|10000000n|E8-10000000|
|99999999|99999999n|E8-99999999|
|100000000|100000000n|E9-100000000|
|999999999|999999999n|E9-999999999|
|1000000000|1000000000n|EE10-1000000000|
|9999999999|9999999999n|EE10-9999999999|
|10000000000|10000000000n|EE11-10000000000|
|99999999999|99999999999n|EE11-99999999999|
|100000000000|100000000000n|EE12-100000000000|
|999999999999|999999999999n|EE12-999999999999|
|1000000000000|1000000000000n|EE13-1000000000000|
|9999999999999|9999999999999n|EE13-9999999999999|
|10000000000000|10000000000000n|EE14-10000000000000|
|99999999999999|99999999999999n|EE14-99999999999999|
|100000000000000|100000000000000n|EE15-100000000000000|
|999999999999999|999999999999999n|EE15-999999999999999|
|1000000000000000|1000000000000000n|EE16-1000000000000000|
|10000000000000000|9999999999999999n|EE16-9999999999999999|
|10000000000000000|10000000000000000n|EE17-10000000000000000|
|100000000000000000|99999999999999999n|EE17-99999999999999999|
|100000000000000000|100000000000000000n|EE18-100000000000000000|
|1000000000000000000|999999999999999999n|EE18-999999999999999999|
|1000000000000000000|1000000000000000000n|EE19-1000000000000000000|
|10000000000000000000|9999999999999999999n|EE19-9999999999999999999|
|10000000000000000000|10000000000000000000n|EE20-10000000000000000000|
|100000000000000000000|99999999999999999999n|EE20-99999999999999999999|
|100000000000000000000|100000000000000000000n|EE21-100000000000000000000|
|1e+21|999999999999999999999n|EE21-999999999999999999999|
|1e+21|1000000000000000000000n|EE22-1000000000000000000000|
|1e+22|9999999999999999999999n|EE22-9999999999999999999999|
|1e+22|10000000000000000000000n|EE23-10000000000000000000000|
|1e+23|99999999999999999999999n|EE23-99999999999999999999999|
|1e+23|100000000000000000000000n|EE24-100000000000000000000000|
|1e+24|999999999999999999999999n|EE24-999999999999999999999999|
|1e+24|1000000000000000000000000n|EE25-1000000000000000000000000|
|1e+25|9999999999999999999999999n|EE25-9999999999999999999999999|
|1e+25|10000000000000000000000000n|EE26-10000000000000000000000000|

## FAQ

### Q. Isn't there some standard way to do this?

A. Not that I could find.

### Q. Is there a maximum number it can handle?

A. No. For example, it could handle a googolplex by starting with a
googol 'E' characters. No problem!  (Of course, no computer in this
universe will ever be able to hold a number as large as a googolplex.)

### Q. Why 'E'

A. It has to be a character that sorts after 9, which is most of
them. Since the notation is very similar to scientific notation, 'E'
seemed like a good idea. We also want it to be a character that's
going to be legal in pretty much every context, including URLs.  'E'
and hyphen seem to pass that test.

### Q. Does the 'E' have to be uppercase?

A. Let's say yes. We don't have a clear example of where a lowercase E
would break something, but it seems like a bad idea.


[npm-image]: https://img.shields.io/npm/v/alpha-sortable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alpha-sortable
