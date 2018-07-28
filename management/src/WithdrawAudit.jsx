import React from 'react'
import {Observable} from 'rxjs-compat'
import {rest} from './utils'
import * as r from 'ramda'
import './Finance.css'
import fuseOptFrom from './fuseOpt'
import Fuse from 'fuse.js'
import dateformat from 'dateformat'
import {AuditAction} from './Action'
import {AuditContext} from './Context'
import Confirm from './audit/Confirm'
import Table from './audit/Table'
import Filter from './audit/Filter'
import {$$} from './utils'
const {Context, Var} = AuditContext

const fuseOpt = fuseOptFrom(['channel.project.name', 'channel.name', 'createdAt'])
const datef = x => x && dateformat(Date.parse(x), 'yyyy年mm月dd日 HH:MM')
const statusMap = {
  'PENDING': {color: 'text-warning', text:'待审核'},
  'PROCESSFAILURE': {color: 'text-danger', text: '处理失败'},
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
  lens: r.compose($$, r.prop('amount'))
},{
  name: '提交时间',
  lens: r.compose(datef,
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

const aDay = 86400000
export default class WithdrawAudit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      withDraw: [],
      auditId: '',
      fund: {},
      user: {},
      filters:{
        from: dateformat(new Date(), 'yyyy-mm-') + '01',
        to: dateformat(new Date(), 'yyyy-mm-dd'),
        status: ''
      },
      summary: {
        sum: 0,
        withdraw: 0,
        fee:0,
        balance:0,
      },
      auditEnable: true,
      query: "",
      fuse: new Fuse([], fuseOpt)
    }
  }
  componentDidMount() {
    this.subscription = Var.startWith(AuditAction.Load).flatMap(action => action.case({
      Load: () => {
        let user = rest(`environments`).map(({response}) => this.setState({
          user: r.find(r.propEq('key','user'))(response)
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
        body: {status: 'DONE', auditor: r.path(['user', 'value', 'id'])(this.state)},
      }).flatMap(()=>Var.next(AuditAction.Load)),
      Deny: id => rest(`boss/withDraw/${id}`, {
        method: 'PUT',
        body: {status: 'PROCESSFAILURE', auditor: r.path(['user','value','id'])(this.state)},
      }).flatMap(()=>Var.next(AuditAction.Load)),
      Filters: filters => {
        return Observable.of(this.setState(r.over(r.lensProp('filters'), r.flip(r.merge)(filters))))
      }
    })).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    let searched = this.state.query? this.state.fuse.search(this.state.query): this.state.withDraw
    let filtered = searched.filter(data =>{
      let createdAt = Date.parse(r.prop('createdAt')(data))
      let status = r.path(['filters', 'status'], this.state)
      return createdAt > Date.parse(r.path(['filters', 'from'], this.state)) &&
             (createdAt - 0) < (Date.parse(r.path(['filters', 'to'], this.state)) - 0 + aDay) &&
             (status=== '' || status === r.prop('status', data))
    })
    let selected = filtered.find(p=> r.prop('id')(p) === this.state.auditId )
    let contextValue = {
      actions: Var,
      table: withDrawTable,
      idLens: r.prop('id'),
      statusLens: r.compose(r.equals("PENDING"), r.prop('status')),
      modalId: "auditing",
    }

    let extraFieldForPopup = r.concat(withDrawTable, [{
      name: '平台剩余金额',
      lens: r.compose($$, r.always(this.state.fund.balance+this.state.fund.frozen))
    },{
      name: '账户余额',
      lens: r.compose($$, r.always(this.state.fund.balance))
    }])
    let fieldsWithOpsTimestamp = r.compose(r.equals('DONE'), r.prop('status'))(selected) ?
      r.concat(extraFieldForPopup, [{
        name:'操作时间',
        lens: r.compose(datef,r.prop('updatedAt')),
      }]):extraFieldForPopup

    return (
      <Context.Provider value={contextValue}>
        <Confirm table={fieldsWithOpsTimestamp} enable={this.state.auditEnable} data={selected} auditId={this.state.auditId} />

        <div className="accordion" id="banking-audit">
          <div className="card">
            <div className="card-header bg-info">
              <h5 className="mb-0">
                提现审核
              </h5>
            </div>
            <div>
              <div className="card-body">
                <div className="form-group row">
                  <input className="form-control col-2" type="search" placeholder="搜索" aria-label="Search" onChange={e=> Var.next(AuditAction.Query(e.target.value))} />
                  <Filter from={this.state.filters.from} to={this.state.filters.to} statusMap={statusMap} />
                  <div className="col-2">
                    平台总金额: <span className="text-warning">{$$(this.state.summary.sum)}</span>元
                  </div>
                  <div className="col-2">
                    可提现总金额: <span className="text-success">{$$(this.state.summary.balance)}</span>元
                  </div>


                </div>
                <Table data={filtered} />
              </div>
            </div>
          </div>
        </div>
      </Context.Provider>
    )
  }
}
