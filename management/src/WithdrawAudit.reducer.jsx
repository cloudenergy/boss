import {AuditContext} from './Context'
import {AuditAction} from './Action'
import {rest} from './utils'
import {Observable} from 'rxjs-compat'
import * as r from 'ramda'
import Fuse from 'fuse.js'
import fuseOptFrom from './fuseOpt'

const {Var} = AuditContext
const withDrawFuseOpt = fuseOptFrom(['channel.project.name', 'channel.name', 'createdAt'])
const topupFuseOpt = fuseOptFrom(['name'])
const reducer = (setState, state) => {
  let withDraw = (from, to) => rest(`boss/withDraw?from=${from}&to=${to}`)
    .map(({response})=>setState({
      withDraw: response.withDraw,
      fuse: new Fuse(response.withDraw, withDrawFuseOpt)
    }))
  let topup = (from, to) => rest(`boss/topup?from=${from}&to=${to}`)
    .map(({response}) => setState({
      topup: response,
      fuse: new Fuse(response, topupFuseOpt)
    }))
  return  Var.startWith(AuditAction.Load).flatMap(action => action.case({
    Load: () => {
      let user = rest(`environments`).map(({response}) => setState({
        user: r.find(r.propEq('key','user'))(response)
      }))
      let summary = rest(`boss/incomeSummary`).map(({response})=>setState({
        summary: response
      }))

      return Observable.merge(user, summary, withDraw(state.filters.from, state.filters.to), topup(state.filters.from, state.filters.to))
    },
    Switch: (channel) => {
      return Observable.of(setState({channel}))
    },
    Popup: (id,status) => {
      let projectid = r.path(['channel', 'project', 'id'])(state.withDraw.find(p=> r.prop('id')(p) === id ))
      return rest(`projects/${projectid}/balance`)
        .map(({response})=>setState({fund:response}))
        .map(()=>setState({auditId: id, auditEnable: status}))
    },
    Query: (str) => Observable.of(setState({query: str})),
    Approve: id => rest(`boss/withDraw/${id}`, {
      method: 'PUT',
      body: {status: 'DONE', auditor: r.path(['user', 'value', 'id'])(state)},
    }).do(()=>Var.next(AuditAction.Load)),
    Deny: id => rest(`boss/withDraw/${id}`, {
      method: 'PUT',
      body: {status: 'PROCESSFAILURE', auditor: r.path(['user','value','id'])(state)},
    }).do(()=>Var.next(AuditAction.Load)),
    Filters: filters => {
      return Observable.of(setState(r.over(r.lensProp('filters'), r.flip(r.merge)(filters))))
    },
    Range: (range) => {
      let update = r.over(r.lensProp('filters'), r.flip(r.merge)(range))
      let updated = update(state)
      return Observable.of(setState(update))
      /* .flatMap(()=>withDraw(range.from, range.to))*/
                       .flatMap(()=>topup(updated.filters.from, updated.filters.to))
    }
  }))
}

export default reducer
