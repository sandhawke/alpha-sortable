import Debug from 'debug'

const debug = new Debug('alpha-sortable')

export function stringify (n, {length} = {length: 4}) {
  const nn = BigInt(n) // throws if non-integer
  if (nn < 0) throw Error('alpha sortable can only handle numbers >= 0')
  
  const s = nn.toString()
  const exp = s.length
  let res
  if (exp <= length) {
    res = '0'.repeat(length - exp) + s
  } else {
    const exps = exp.toString()
    res = 'E'.repeat(exps.length) + exps + '-' + s
  }
  return res
}

export function parse (s, {strict, float} = {strict: true, float: true}) {
  const m = s.match(/\s*((E+)(\d+)-)?(\d+)/i)
  if (!m) throw Error('alpha-sortable encoded number not found')
  const [full, lead, es, exp, mant] = m
  console.log({lead, es, exp, mant})
  
  if (lead && strict) {
    if (es.length !== exp.length) throw Error('alpha-sortable mismatch between number of Es and digits in exponent')
    const expn = parseInt(exp)
    if (expn !== mant.length) throw Error(`alpha-sortable number has ${mant.length} when ${expn} digits were declared`)
    if (es.match(/e/)) throw Error('alpha-sortable "E" flag must be uppercase')
  }
  
  const n = BigInt(mant)
  if (float && n <= Number.MAX_SAFE_INTEGER) return Number(n)
}

export default {stringify, parse}
