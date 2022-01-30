import {stringify} from './index.js'

const rows = []
for (let i = -3; i < 0; i++) {
  rows.push({Number: i, BigInt: BigInt(i), encoded: stringify(i)})
}
for (let i = 1n; i < 100000000000000000000000000n; i = i * 10n) {
  rows.push({Number: Number(i)-1, BigInt: (i-1n), encoded: stringify(i-1n)})
  rows.push({Number: Number(i), BigInt: (i), encoded: stringify(i)})
}

console.table(rows)

console.log('|%s|%s|%s|', 'Number', 'BigInt', 'encoded {length: 4}')
console.log('|%s|%s|%s|', '------', '------', '-------')
for (const {Number, BigInt, encoded} of rows) {
  console.log('|%s|%s|%s|', Number, BigInt, encoded)
}

