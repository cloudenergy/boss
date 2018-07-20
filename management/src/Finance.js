
import React from 'react'
import {Observable} from 'rxjs-compat'
import {rest} from './utils'
import * as r from 'ramda'
import './Finance.css'
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
  name: '账户名',
  lens: r.view(r.lensPath(['fundChannel','name']))
},{
  name: '银行卡号/支付宝账号',
  lens: r.view(r.lensPath(['account']))
},{
  name: '支行名称',
  lens: r.view(r.lensProp('subbranch'))
},{
  name: '账户归属区域',
  lens: x =>
    r.path(['locate', 'province'], x) + r.path(['locate', 'city'], x) + r.path(['locate', 'district'],x)
},{
  name: '审核',
  lens: r.compose(status=><span className={r.view(lensStatusMap(status, 'color'))(statusMap)}>
    {r.view(lensStatusMap(status, 'text'))(statusMap)}
  </span>,
                  r.view(r.lensPath(['fundChannel', 'status'])))
},{
  name: '申请时间',
  lens: r.compose(x=>x && datef(Date.parse(x), 'yyyy年mm月dd日 HH:MM'),
                  r.view(r.lensPath(['fundChannel', 'createdAt'])))
}]

const contextValue = {
  actions: Var,
  table:payChannelTable,
  idLens: r.view(r.lensPath(['fundChannel', 'id'])),
  statusLens: r.compose(r.equals("PENDING"), r.view(r.lensPath(['fundChannel', 'status']))),
  modalId: "auditing",
  color: "bg-info",
}

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
    this.subscription = Var.startWith(AuditAction.Load).flatMap(action => action.case({
      Load: () => rest('boss/payChannels')
        .map(({response})=>this.setState({
          payChannel: response.payChannel,
          fuse: new Fuse(response.payChannel, fuseOpt)
        })),
      Popup: (id,status) => Observable.of(this.setState({auditId: id, auditEnable: status})),
      Query: (str) => Observable.of(this.setState({query: str})),
      Approve: id => rest(`boss/fundChannels/${id}/status`, {
        method: 'PUT',
        body: {status: 'PASSED'},
      }).flatMap(()=>Var.next(AuditAction.Load)),
      Deny: id => rest(`boss/fundChannels/${id}/status`, {
        method: 'PUT',
        body: {status: 'DENY'},
      }).flatMap(()=>Var.next(AuditAction.Load))
    })).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    let filtered = this.state.query? this.state.fuse.search(this.state.query): this.state.payChannel
    let selected = filtered.find(p=> r.path(['fundChannel', 'id'])(p)=== this.state.auditId )
    return (
        <Context.Provider value={contextValue}>
          <Confirm enable={this.state.auditEnable} data={selected} auditId={this.state.auditId} />
          <Table data={filtered} title="银行卡审核" />
        </Context.Provider>
    )
  }
}
