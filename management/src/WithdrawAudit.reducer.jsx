import {AuditContext} from './Context'
import {AuditAction} from './Action'
import {rest} from './utils'
import {Observable} from 'rxjs-compat'
import * as r from 'ramda'
import Fuse from 'fuse.js'
import fuseOptFrom from './fuseOpt'

const fuseOpt = fuseOptFrom(['channel.project.name', 'channel.name', 'createdAt'])
const {Var} = AuditContext

const reducer = (setState, state) => Var.startWith(AuditAction.Load).flatMap(action => action.case({
  Load: () => {
    let user = rest(`environments`).map(({response}) => setState({
      user: r.find(r.propEq('key','user'))(response)
    }))
    let summary = rest(`boss/incomeSummary`).map(({response})=>setState({
      summary: response
    }))
    let withDraw = rest('boss/withDraw')
      .map(({response})=>setState({
        withDraw: response.withDraw,
        fuse: new Fuse(response.withDraw, fuseOpt)
      }))
    return Observable.merge(user, summary, withDraw)
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
  }).flatMap(()=>Var.next(AuditAction.Load)),
  Deny: id => rest(`boss/withDraw/${id}`, {
    method: 'PUT',
    body: {status: 'PROCESSFAILURE', auditor: r.path(['user','value','id'])(state)},
  }).flatMap(()=>Var.next(AuditAction.Load)),
  Filters: filters => {
    return Observable.of(setState(r.over(r.lensProp('filters'), r.flip(r.merge)(filters))))
  }
}))

export default reducer
