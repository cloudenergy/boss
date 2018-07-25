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

const fuseOpt = fuseOptFrom(['channel.project.name', 'channel.name', 'createdAt'])

const statusMap = {
  'PASSED': {color: 'text-success', text: '通过'},
  'AUDITFAILURE': {color: 'text-danger', text: '审核失败'},
  'PROCESSFAILURE': {color: 'text-danger', text: '处理失败'},
  'PENDING': {color: 'text-warning', text:'待审核'},
  'PROCESSING':{color: 'text-info', text: '正在处理'},
  'DONE': {color: 'text-success', text: '交易成功'}
}
const lensStatusMap = (status, val) => r.lensPath([status, val])

const withDrawTable =[{
  name: '项目名称',
  lens: r.view(r.lensPath(['channel', 'project', 'name']))
},{
  name: '交易账户',
  lens: r.view(r.lensPath(['channel', 'name']))
},{
  name: '提现金额',
  lens: r.view(r.lensProp('amount'))
},{
  name: '提交时间',
  lens: r.compose(x=>x && datef(Date.parse(x), 'yyyy年mm月dd日 HH:MM'),
                  r.view(r.lensPath(['createdAt'])))
},{
  name: '交易状态',
  lens: r.compose(status=><span className={r.view(lensStatusMap(status, 'color'))(statusMap)}>
    {r.view(lensStatusMap(status, 'text'))(statusMap)}
  </span>,
                  r.prop('status'))
},{
  name: '审核人',
  lens: r.path(['auth', 'username'])
}]


export default class WithdrawAudit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      withDraw: [],
      auditId: '',
      fund: {},
      user: {},
      summary: {},
      auditEnable: true,
      query: "",
      fuse: new Fuse([], fuseOpt)
    }
  }
  componentDidMount() {
    this.subscription = Var.startWith(AuditAction.Load).flatMap(action => action.case({
      Load: () => {
        let user = rest(`projects/100/credentials`).map(({response}) => this.setState({
          user: r.last(response)
        }))
        let summary = rest(`boss/incomeSummary`).map(({response})=>this.setState({
          summary: response
        }))
        let withDraw = rest('boss/withDraw')
        .map(({response})=>this.setState({
          withDraw: response.withDraw,
          fuse: new Fuse(response.withDraw, fuseOpt)
        }))
        return Observable.merge(user, summary, withDraw)
      },
      Popup: (id,status) => {
        let projectid = r.path(['channel', 'project', 'id'])(this.state.withDraw.find(p=> r.prop('id')(p) === id ))
        return rest(`projects/${projectid}/balance`)
        .map(({response})=>this.setState({fund:response}))
          .map(()=>this.setState({auditId: id, auditEnable: status}))
      },
      Query: (str) => Observable.of(this.setState({query: str})),
      Approve: id => rest(`boss/withDraw/${id}`, {
        method: 'PUT',
        body: {status: 'PASSED', auditor: r.path(['user', 'id'])(this.state)},
      }).flatMap(()=>Var.next(AuditAction.Load)),
      Deny: id => rest(`boss/withDraw/${id}`, {
        method: 'PUT',
        body: {status: 'PROCESSFAILURE', auditor: r.path(['user','id'])(this.state)},
      }).flatMap(()=>Var.next(AuditAction.Load))
    })).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    let filtered = this.state.query? this.state.fuse.search(this.state.query): this.state.withDraw
    let selected = filtered.find(p=> r.prop('id')(p) === this.state.auditId )
    let contextValue = {
      actions: Var,
      table: withDrawTable,
      idLens: r.prop('id'),
      statusLens: r.compose(r.equals("PENDING"), r.prop('status')),
      modalId: "auditing",
      color: "bg-warning",
    }

    return (
      <Context.Provider value={contextValue}>
        <Confirm table={r.concat(withDrawTable, [{
            name: '平台剩余金额',
            lens: r.always(this.state.fund.balance+this.state.fund.frozen)
        },{
            name: '账户余额',
            lens: r.always(this.state.fund.balance)
        }])} enable={this.state.auditEnable} data={selected} auditId={this.state.auditId} />
        <Table title="提现审核" data={filtered} />
      </Context.Provider>
    )
  }
}
