/* eslint-env jest */
import * as my from './index.js'
import Debug from 'debug'

const debug = new Debug('alpha-sortable/test')

test('default stringify', () => {
  expect(my.stringify(0)).toBe('0000')
  expect(my.stringify(9999)).toBe('9999')
  expect(my.stringify(10000)).toBe('=5_10000')
  expect(my.stringify(999999999)).toBe('=9_999999999')
  expect(my.stringify(1000000000)).toBe('==10_1000000000')
})

test('default stringify bigint', () => {
  expect(my.stringify(0n)).toBe('0000')
  expect(my.stringify(9999n)).toBe('9999')
  expect(my.stringify(10000n)).toBe('=5_10000')
  expect(my.stringify(999999999n)).toBe('=9_999999999')
  expect(my.stringify(1000000000n)).toBe('==10_1000000000')
  expect(my.stringify(100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n)).toBe('==99_100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
  expect(my.stringify(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n)).toBe('===100_1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
})

test('stringify length', () => {
  expect(my.stringify(1, {length: 0})).toBe('=1_1')
  expect(my.stringify(1, {length: 1})).toBe('1')
  expect(my.stringify(1, {length: 2})).toBe('01')
  expect(my.stringify(1, {length: 3})).toBe('001')
  expect(my.stringify(1, {length: 20})).toBe('00000000000000000001')
  
})
     
test('stringify errors', () => {
  expect(() => my.stringify(1, {length: -1})).toThrow(my.OutOfRange)
  expect(() => my.stringify(null)).toThrow(TypeError)
})

test('default parse', () => {
  expect(my.parse('0')).toBe(0)  // hrmmm, in strict, should this be an error
  expect(my.parse('0000')).toBe(0)
  expect(my.parse('000000000000000000000000000000')).toBe(0)
  expect(my.parse('1')).toBe(1)
  expect(my.parse('1000000001')).toBe(1000000001)
  expect(my.parse('1000000000000000000000000000001')).toBe(1000000000000000000000000000001n)
  expect(my.parse('=5_10000')).toBe(10000)
  expect(my.parse('=9_100000000')).toBe(100000000)
})

const samples = [
  9,
  10,
  11,
  99,
  100,
  0,
  1,
  1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002n,
  2,
  199,
  999,
  1000,
  90000,
  10000000000000000000000000000000000000000000000000000000000000000000000000000000n,
  10000000000000000000000000000000000000000000000000000000000000000000000000000001n,
  10000000000000000000000000000000000000000000000000000000000000000000000000000002n,
  9999,
  10000,
  10001,
  1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n,
  1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001n
]

test('round trip with sorting', () => {
  const out = []
  for (const s of samples) {
    expect(my.parse(my.stringify(s, {length: 0}))).toBe(s)
    expect(my.parse(my.stringify(s, {length: 1}))).toBe(s)
    expect(my.parse(my.stringify(s, {length: 2}))).toBe(s)
    expect(my.parse(my.stringify(s, {length: 3}))).toBe(s)
    expect(my.parse(my.stringify(s, {length: 4}))).toBe(s)

    const str = my.stringify(s)
    out.push(str)
    expect(my.parse(str)).toBe(s)
  }
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  samples.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
  // console.log(samples)
  out.sort()
  // console.log(out)
  for (let i = 0; i < out.length; i++) {
    expect(my.stringify(samples[i])).toBe(out[i])
  }
})

test('a whole bunch of numbers', () => {
  const rows = []
  rows.push({Number: -3, BigInt: BigInt(-3), encoded: my.stringify(-1)})
  rows.push({Number: -2, BigInt: BigInt(-2), encoded: my.stringify(-1)})
  rows.push({Number: -1, BigInt: BigInt(-1), encoded: my.stringify(-1)})
  for (let i = 1n; i < 100000000000000000000000000n; i = i * 10n) {
    rows.push({Number: Number(i)-1, BigInt: (i-1n), encoded: my.stringify(i-1n)})
    rows.push({Number: Number(i), BigInt: (i), encoded: my.stringify(i)})
    expect(my.parse(my.stringify(i), {float: false})).toBe(i)
  }
  console.table(rows)
  
  const r1 = [...rows]
  r1.sort((x, y) => Number(x.BigInt - y.BigInt))
  // console.log({r1})
  const r2 = [...rows]
  // NOPE, localeCompare is weird r2.sort((x, y) => x.encoded.localeCompare(y.encoded))
  r2.sort((x, y) => x.encoded < y.encoded ? -1 : (x.encoded === y.encoded ? 0 : 1))
  // console.log({r2})
  expect(r1).toEqual(r2)
  expect(rows).toEqual(r1)
})

test('negative', () => {
  const a = [ -1, -10, -2, -20, -1, -15 ]
  const b = a.map(my.stringify)
  b.sort()
  const c = b.map(my.parse)
  a.sort((x, y) => (x - y))
  // console.log({a, c})
  expect(a).toEqual(c)
})
