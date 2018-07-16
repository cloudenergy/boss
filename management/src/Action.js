import Type from 'union-type'
import * as r from 'ramda'
export function is(x) { return r.where({_name: r.equals(x)})}
export const AuditAction = Type({
  Load:[],
  Approve:[Number],
  Deny:[Number],
  Popup:[Number, Boolean],
  Query:[String],
})
