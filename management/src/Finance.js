
import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'
import './Finance.css'
import {createActionContext} from './Context'
import * as Type from 'union-type'

import fuseOptFrom from './fuseOpt'
import Fuse from 'fuse.js'
import datef from 'dateformat'
import {AuditAction} from './Action'
import {AuditContext} from './Context'
import Confirm from './audit/Confirm'
import Table from './audit/Table'
const {Context, Var} = AuditContext
const fuseOpt = fuseOptFrom(['fundChannel.project.name', 'account', 'subbranch', 'locate', 'fundChannel.status'])

const statusMap = {
  'PASSED': {color: 'text-success', text: '通过'},
  'DENY': {color: 'text-danger', text: '失败'},
  'PENDING': {color: 'text-warning', text:'待审核'}
}
const lensStatusMap = (status, val) => r.lensPath([status, val])

const payChannelTable = [{
  name: '项目名称',
  lens: r.view(r.lensPath(['fundChannel', 'project', 'name']))
},{
  name: '行卡号/支付宝账号',
  lens: r.view(r.lensPath(['account']))
},{
  name: '支行名称',
  lens: r.view(r.lensProp('subbranch'))
},{
  name: '账户归属区域',
  lens: r.view(r.lensPath(['locate']))
},{
  name: '审核',
  lens: r.compose(status=><span className={r.view(lensStatusMap(status, 'color'))(statusMap)}>
    {r.view(lensStatusMap(status, 'text'))(statusMap)}
  </span>,
                  r.view(r.lensPath(['fundChannel', 'status'])))
},{
  name: '申请时间',
  lens: r.compose(x=>datef(Date.parse(x), 'yyyy年mm月dd日 HH:MM'),
                  r.view(r.lensPath(['fundChannel', 'createdAt'])))
}]

const modalId = "auditing"

export default class Finance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      payChannel: [],
      auditId: '',
      auditEnable: true,
      query: "",
      fuse: new Fuse([], fuseOpt)
    }
  }
  componentDidMount() {
    this.subscription = AuditContext.Var.startWith(AuditAction.Load).flatMap(action => action.case({
      Load: () => Observable
        .ajax({url: `${API_URI}/v1.0/boss/finance`,
               crossDomain:true,
               withCredentials: true})
        .map(({response})=>this.setState({
          payChannel: response.payChannel,
          fuse: new Fuse(response.payChannel, fuseOpt)
        })),
      Popup: (id,status) => Observable.of(this.setState({auditId: id, auditEnable: status})),
      Query: (str) => Observable.of(this.setState({query: str})),
      Approve: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'PASSED'},
        crossDomain:true,
        withCredentials: true}).flatMap(()=>AuditContext.Var.next(AuditAction.Load)),
      Deny: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'DENY'},
        crossDomain:true,
        withCredentials: true}).flatMap(()=>AuditContext.Var.next(AuditAction.Load))
    })).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    let filtered = this.state.query? this.state.fuse.search(this.state.query): this.state.payChannel
    let selected = filtered.find(p=> r.path(['fundChannel', 'id'])(p)=== this.state.auditId )
    return (
      <div>
        <Context.Provider value={{actions: AuditContext.Var, table:payChannelTable, modalId }}>
          <Confirm enable={this.state.auditEnable} data={selected} auditId={this.state.auditId} />
          <Table data={filtered} />
        </Context.Provider>
      </div>
    )
  }
}
