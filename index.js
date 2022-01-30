import Debug from 'debug'
import { createError } from 'better-custom-error'

export const OutOfRange = createError('OutOfRange', RangeError)
export const BadSyntax = createError('BadSyntax', SyntaxError)

const debug = new Debug('alpha-sortable')

export function stringify (n, { length } = { length: 4 }) {
  if (n < 0) {
    if (n < Number.MIN_SAFE_INTEGER) throw OutOfRange('cannot serialize numbers below ' + Number.MIN_SAFE_INTEGER)
    if (n !== Math.floor(n)) throw OutOfRange('cannot serialize non-integers')
    const v = n - Number.MIN_SAFE_INTEGER
    return '-M+' + v
  }
  
  const nn = BigInt(n) // throws if non-integer
  if (nn < 0) throw new OutOfRange('cannot serialize negative numbers', { n })
  if (length < 0) throw OutOfRange('length must be at least 0', { length })

  const s = nn.toString()
  const exp = s.length
  let res
  if (exp <= length) {
    res = '0'.repeat(length - exp) + s
  } else {
    const exps = exp.toString()
    res = '='.repeat(exps.length) + exps + '_' + s
  }
  return res
}

export function parse (s, { strict, float } = { strict: true, float: true }) {
  if (s.startsWith('-M+')) {
    const v = parseInt(s.slice(3))
    return Number.MIN_SAFE_INTEGER + v
  }
  const m = s.match(/\s*((=+)(\d+)_)?(\d+)/i)
  if (!m) throw Error('alpha-sortable encoded number not found')
  const [full, lead, es, exp, mant] = m
  // console.log({lead, es, exp, mant})

  if (lead && strict) {
    if (es.length !== exp.length) throw Error('alpha-sortable mismatch between number of equal-chars and digits in exponent')
    const expn = parseInt(exp)
    if (expn !== mant.length) throw Error(`alpha-sortable number has ${mant.length} when ${expn} digits were declared`)
    // if (es.match(/e/)) throw Error('alpha-sortable "D" flag must be uppercase')
  }

  const n = BigInt(mant)
  if (float && n <= Number.MAX_SAFE_INTEGER) return Number(n)
  return n
}

export default { stringify, parse }
