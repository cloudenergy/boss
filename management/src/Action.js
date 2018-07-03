const Type = require('union-type')
const r = require('ramda')
const Action = Type({Nav:[String]})

export function is(x) { return r.where({_name: r.equals(x)})}

export default Action
