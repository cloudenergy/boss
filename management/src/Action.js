const r = require('ramda')

export function is(x) { return r.where({_name: r.equals(x)})}
