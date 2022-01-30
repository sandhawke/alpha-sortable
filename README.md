# alpha-sortable
[![NPM version][npm-image]][npm-url]

Encode/decode numbers in strings so that they sort properly

## Why?

* Because sometimes you want items sorted in numeric order, even though they are sorted on a text field.  Example: filenames.
* Zero padding only works if your users are okay with lots of zeros, and/or you know your numbers will never get large.

## How?

1. Zero-pad to a reasonable amount -- like how big you think things will *probably* get in the life of the system
2. When you get bigger numbers, prefix them with a flagged length that keeps them sorting properly. The flag is a "=" for every digit in the length counter, followed by the length counter, followed by an underscore.
3. Negative integers down to Number.MIN_SAFE_INTEGER are serialized as "-M+" followed by the number minus Number.MIN_SAFE_INTEGER

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
|-3|-3n|-M+9007199254740988|
|-2|-2n|-M+9007199254740989|
|-1|-1n|-M+9007199254740990|
|0|0n|0000|
|1|1n|0001|
|9|9n|0009|
|10|10n|0010|
|99|99n|0099|
|100|100n|0100|
|999|999n|0999|
|1000|1000n|1000|
|9999|9999n|9999|
|10000|10000n|=5_10000|
|99999|99999n|=5_99999|
|100000|100000n|=6_100000|
|999999|999999n|=6_999999|
|1000000|1000000n|=7_1000000|
|9999999|9999999n|=7_9999999|
|10000000|10000000n|=8_10000000|
|99999999|99999999n|=8_99999999|
|100000000|100000000n|=9_100000000|
|999999999|999999999n|=9_999999999|
|1000000000|1000000000n|==10_1000000000|
|9999999999|9999999999n|==10_9999999999|
|10000000000|10000000000n|==11_10000000000|
|99999999999|99999999999n|==11_99999999999|
|100000000000|100000000000n|==12_100000000000|
|999999999999|999999999999n|==12_999999999999|
|1000000000000|1000000000000n|==13_1000000000000|
|9999999999999|9999999999999n|==13_9999999999999|
|10000000000000|10000000000000n|==14_10000000000000|
|99999999999999|99999999999999n|==14_99999999999999|
|100000000000000|100000000000000n|==15_100000000000000|
|999999999999999|999999999999999n|==15_999999999999999|
|1000000000000000|1000000000000000n|==16_1000000000000000|
|10000000000000000|9999999999999999n|==16_9999999999999999|
|10000000000000000|10000000000000000n|==17_10000000000000000|
|100000000000000000|99999999999999999n|==17_99999999999999999|
|100000000000000000|100000000000000000n|==18_100000000000000000|
|1000000000000000000|999999999999999999n|==18_999999999999999999|
|1000000000000000000|1000000000000000000n|==19_1000000000000000000|
|10000000000000000000|9999999999999999999n|==19_9999999999999999999|
|10000000000000000000|10000000000000000000n|==20_10000000000000000000|
|100000000000000000000|99999999999999999999n|==20_99999999999999999999|
|100000000000000000000|100000000000000000000n|==21_100000000000000000000|
|1e+21|999999999999999999999n|==21_999999999999999999999|
|1e+21|1000000000000000000000n|==22_1000000000000000000000|
|1e+22|9999999999999999999999n|==22_9999999999999999999999|
|1e+22|10000000000000000000000n|==23_10000000000000000000000|
|1e+23|99999999999999999999999n|==23_99999999999999999999999|
|1e+23|100000000000000000000000n|==24_100000000000000000000000|
|1e+24|999999999999999999999999n|==24_999999999999999999999999|
|1e+24|1000000000000000000000000n|==25_1000000000000000000000000|
|1e+25|9999999999999999999999999n|==25_9999999999999999999999999|
|1e+25|10000000000000000000000000n|==26_10000000000000000000000000|

## FAQ

### Q. Isn't there some standard way to do this?

A. Not that I could find.

### Q. Is there a maximum number it can handle?

A. No. For example, it could handle a googolplex by starting with a
googol '=' characters. No problem!  (Of course, no computer in this
universe will ever be able to hold a number as large as a googolplex.)

### Q. Why '='

A. We want it to sort between the numbers and the words, so that means ":;<=>?@" are the options. "<>?" tend to be meta-characters.  Among ":;=@", "=" seemed the most number-related, and the least likely to be a metacharacter.

### Q. Why are negative numbers so ugly and limited?

This was the first thing I thought of.

We could do it as -dd_n where dd is two digit number giving us the offset, as offset = 10**(100-dd).  That gets us down to 1e-99 or so, which is pretty good!

* -99 => -98_01
* -10 => -98_99
* -2 => -99_8
* -1 => -99_9

[npm-image]: https://img.shields.io/npm/v/alpha-sortable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alpha-sortable
