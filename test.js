/* eslint-env jest */
import * as my from '.'
import Debug from 'debug'

const debug = new Debug('alpha-sortable/test')

test('default stringify', async () => {
  expect(my.stringify(0)).toBe('0000')
  expect(my.stringify(9999)).toBe('9999')
  expect(my.stringify(10000)).toBe('E5-10000')
  expect(my.stringify(999999999)).toBe('E9-999999999')
  expect(my.stringify(1000000000)).toBe('EE10-1000000000')
})

test('default stringify bigint', async () => {
  expect(my.stringify(0n)).toBe('0000')
  expect(my.stringify(9999n)).toBe('9999')
  expect(my.stringify(10000n)).toBe('E5-10000')
  expect(my.stringify(999999999n)).toBe('E9-999999999')
  expect(my.stringify(1000000000n)).toBe('EE10-1000000000')
  expect(my.stringify(100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n)).toBe('EE99-100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
  expect(my.stringify(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000n)).toBe('EEE100-1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
})
