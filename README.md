# alpha-sortable
[![NPM version][npm-image]][npm-url]

Encode/decode numbers in strings so that they sort properly

## Why?

* Because sometimes you want items sorted in numeric order, even though they are sorted on a text field.  Example: filenames.
* Zero padding only works if your users are okay with lots of zeros, and/or you know your numbers will never get large.

## How?

1. Zero-pad to a reasonable amount -- like how big you think things will *probably* get in the life of the system
2. When you get bigger numbers, prefix them with a flagged length that keeps them sorting properly. The flag is an 'D' for every digit in the length counter, followed by the length counter, followed by a hyphen.

A few examples (more below):

|Number|Encoded with default setting {length: 4}|
|------|-------|
|1|0001|
|10|0010|
|100|0100|
|1000|1000|
|10000|D5-10000|
|100000000|D9-100000000|  
|1000000000|DD10-1000000000|
|1e+100|DDD101-10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000|

## API

```js
import {stringify, parse} from 'alpha-sortable'

console.log(stringify(20))
// => 0020

console.log(stringify(20, {length: 2}))
// => 20

console.log(stringify(20000000))
// => D8-20000000

console.log(parse('D8-20000000') === 20000000)
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
|10000|10000n|D5-10000|
|99999|99999n|D5-99999|
|100000|100000n|D6-100000|
|999999|999999n|D6-999999|
|1000000|1000000n|D7-1000000|
|9999999|9999999n|D7-9999999|
|10000000|10000000n|D8-10000000|
|99999999|99999999n|D8-99999999|
|100000000|100000000n|D9-100000000|
|999999999|999999999n|D9-999999999|
|1000000000|1000000000n|DD10-1000000000|
|9999999999|9999999999n|DD10-9999999999|
|10000000000|10000000000n|DD11-10000000000|
|99999999999|99999999999n|DD11-99999999999|
|100000000000|100000000000n|DD12-100000000000|
|999999999999|999999999999n|DD12-999999999999|
|1000000000000|1000000000000n|DD13-1000000000000|
|9999999999999|9999999999999n|DD13-9999999999999|
|10000000000000|10000000000000n|DD14-10000000000000|
|99999999999999|99999999999999n|DD14-99999999999999|
|100000000000000|100000000000000n|DD15-100000000000000|
|999999999999999|999999999999999n|DD15-999999999999999|
|1000000000000000|1000000000000000n|DD16-1000000000000000|
|10000000000000000|9999999999999999n|DD16-9999999999999999|
|10000000000000000|10000000000000000n|DD17-10000000000000000|
|100000000000000000|99999999999999999n|DD17-99999999999999999|
|100000000000000000|100000000000000000n|DD18-100000000000000000|
|1000000000000000000|999999999999999999n|DD18-999999999999999999|
|1000000000000000000|1000000000000000000n|DD19-1000000000000000000|
|10000000000000000000|9999999999999999999n|DD19-9999999999999999999|
|10000000000000000000|10000000000000000000n|DD20-10000000000000000000|
|100000000000000000000|99999999999999999999n|DD20-99999999999999999999|
|100000000000000000000|100000000000000000000n|DD21-100000000000000000000|
|1e+21|999999999999999999999n|DD21-999999999999999999999|
|1e+21|1000000000000000000000n|DD22-1000000000000000000000|
|1e+22|9999999999999999999999n|DD22-9999999999999999999999|
|1e+22|10000000000000000000000n|DD23-10000000000000000000000|
|1e+23|99999999999999999999999n|DD23-99999999999999999999999|
|1e+23|100000000000000000000000n|DD24-100000000000000000000000|
|1e+24|999999999999999999999999n|DD24-999999999999999999999999|
|1e+24|1000000000000000000000000n|DD25-1000000000000000000000000|
|1e+25|9999999999999999999999999n|DD25-9999999999999999999999999|
|1e+25|10000000000000000000000000n|DD26-10000000000000000000000000|

## FAQ

### Q. Isn't there some standard way to do this?

A. Not that I could find.

### Q. Is there a maximum number it can handle?

A. No. For example, it could handle a googolplex by starting with a
googol 'D' characters. No problem!  (Of course, no computer in this
universe will ever be able to hold a number as large as a googolplex.)

### Q. Why 'D'

A. It standands for "digits".

It has to be a character that sorts after 9, which is most of them. I
thought about 'E', since this is similar to scientific notation, but
(1) that kind of seems like an error identifier, and (2) this is not
scientific notation.

### Q. Does the 'D' have to be uppercase?

A. Let's say yes. We don't have a clear example of where a lowercase D
would break something, but it seems like a bad idea.

### Q. What if I want to keep the numbers sorted before the words?

A. Perhaps we should use an encoding like '=5_12345' and
'==10_1234567890'. The equals character falls between 9 and A in
ASCII/Unicode. That also keeps the encoding outside the space one
would typically use for string values. I'm thinking '_' instead of '-'
to reduce confusion with spreadsheet syntax (where '=5-12345' means
the value of the cell is 5 minus 12345, or -12340).

[npm-image]: https://img.shields.io/npm/v/alpha-sortable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alpha-sortable
