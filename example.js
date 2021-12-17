import { stringify, parse } from './index.js' // alpha-sortable'
console.log(stringify(20))
// => 0020
console.log(stringify(20, { length: 2 }))
// => 20
console.log(stringify(20000000))
// => D8-20000000

console.log(parse('D8-20000000') === 20000000)
// true

console.log(stringify(1e+100))
