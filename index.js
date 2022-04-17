import Debug from 'debug'
import { createError } from 'better-custom-error'

export const OutOfRange = createError('OutOfRange', RangeError)
export const BadSyntax = createError('BadSyntax', SyntaxError)

const debug = new Debug('alpha-sortable')

function pad (n, len) {
  const s = n.toString()
  return '0'.repeat(len - s.length) + s
}
export function stringify (n, { length } = { length: 4 }) {
  const nn = BigInt(n) // throws if non-integer
  if (length < 0) throw OutOfRange('length must be at least 0', { length })

  if (nn < 0) {
    const ns = nn.toString()
    const nexp = ns.length
    const len = nexp - 1
    const offset = 10n ** BigInt(len)
    const newVal = nn + offset
    const padded = pad(newVal, len)
    const invlen = 100-len
    if (invlen < 1) throw OutOfRange('negative number too low')
    const res = '-' + pad(invlen, 2) + '_' + padded
    // console.log({n, nn, len, offset, newVal, padded, res})
    return res
  }

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
  let m = s.match(/\s*-(\d\d)_(\d+)/)
  if (m) {
    const [full, invlen, padded] = m
    const len = 100-invlen
    if (len !== padded.length) throw Error('wrong len')
    const offset = 10n ** BigInt(len)
    const newVal = BigInt(padded)
    const n = newVal - offset
    // console.log({full, len, offset, newVal, n})
    if (float && n <= Number.MAX_SAFE_INTEGER) return Number(n)
    return n
  }
  
  m = s.match(/\s*((=+)(\d+)_)?(\d+)/i)
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
