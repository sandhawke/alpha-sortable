
import {stringify, parse} from './index.js'

/*
stringify(-1)
stringify(-9)
stringify(-10)
stringify(-11)
stringify(-99)
stringify(-100)
*/

test('', () => {
const rows = []

function row (j) {
  const encoded = stringify(j)
  const decoded = parse(encoded, {float: false})
  rows.push({Number: Number(j), BigInt: (j), encoded, decoded})
  expect(decoded).toBe(j)
}

for (let i = 1n; i < 100000000000000000000000000n; i = i * 10n) {
  let j = ( -1n * i ) + 1n
  row(j)
  j--
  row(j)
  j--
  row(j)
}
console.table(rows)
  
})

test('max neg', () => {
  function f (j) {
    const encoded = stringify(j)
    const decoded = parse(encoded, {float: false})
    // rows.push({Number: Number(j), BigInt: (j), encoded, decoded})
    expect(decoded).toBe(j)
    // console.log({j, encoded, decoded})
    return encoded
  }
  let i = -123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789n
  f(i)
  // the lowest number we can do, negative googol plus one
  i = -1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n + 1n
  expect(f(i)).toBe('-01_000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001')
  i--
  expect(() => {f(i)}).toThrow(RangeError)
})
