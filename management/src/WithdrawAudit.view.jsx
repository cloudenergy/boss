import React from 'react'
import * as r from 'ramda'
import './Finance.css'
import dateformat from 'dateformat'
import {AuditAction} from './Action'
import {AuditContext} from './Context'
import Confirm from './audit/Confirm'
import Table from './audit/Table'
import Filter from './audit/Filter'
import {$$} from './utils'
const {Context, Var} = AuditContext
const aDay = 86400000
const datef = x => x && dateformat(Date.parse(x), 'yyyy年mm月dd日 HH:MM')
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
const statusMap = {
  'PENDING': {color: 'text-warning', text:'待审核'},
  'PROCESSFAILURE': {color: 'text-danger', text: '处理失败'},
  'DONE': {color: 'text-success', text: '交易成功'}
}
const lensStatusMap = (status, val) => r.lensPath([status, val])

export default function View(props){
  let searched = props.query? props.fuse.search(props.query): props.withDraw
  let filtered = searched.filter(data =>{
    let createdAt = Date.parse(r.prop('createdAt')(data))
    let status = r.path(['filters', 'status'], props)
    return createdAt > Date.parse(r.path(['filters', 'from'], props)) &&
           (createdAt - 0) < (Date.parse(r.path(['filters', 'to'], props)) - 0 + aDay) &&
           (status=== '' || status === r.prop('status', data))
  })

  let selected = filtered.find(p=> r.prop('id')(p) === props.auditId )
  let contextValue = {
    actions: Var,
    table: withDrawTable,
    idLens: r.prop('id'),
    statusLens: r.compose(r.equals("PENDING"), r.prop('status')),
    modalId: "auditing",
    channel: props.channel,
  }

  let extraFieldForPopup = r.concat(withDrawTable, [{
    name: '平台剩余金额',
    lens: r.compose($$, r.always(props.fund.balance+props.fund.frozen))
  },{
    name: '账户余额',
    lens: r.compose($$, r.always(props.fund.balance))
  }])
  let fieldsWithOpsTimestamp = r.compose(r.equals('DONE'), r.prop('status'))(selected) ?
                               r.concat(extraFieldForPopup, [{
                                 name:'操作时间',
                                 lens: r.compose(datef,r.prop('updatedAt')),
                               }]):extraFieldForPopup

  return (
    <Context.Provider value={contextValue}>
      <Confirm table={fieldsWithOpsTimestamp} enable={props.auditEnable} data={selected} auditId={props.auditId} />

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
                <Filter from={props.filters.from} to={props.filters.to} statusMap={statusMap} />
                <div className="col-2">
                  平台总金额: <span className="text-warning">{$$(props.summary.sum)}</span>元
                </div>
                <div className="col-2">
                  可提现总金额: <span className="text-success">{$$(props.summary.balance)}</span>元
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
