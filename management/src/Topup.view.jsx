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

const lensStatusMap = (status, val) => r.lensPath([status, val])
const statusMap = {
  'pending': {color: 'text-warning', text:'待处理'},
  'declined': {color: 'text-danger', text: '失败'},
  'approved': {color: 'text-success', text: '成功'}
}

const TopupTable =[{
  name: '金额',
  lens: r.compose($$,r.prop('amount'))
},{
  name: '手续费',
  lens: r.compose($$, r.prop('fee'))
},{
  name: '操作后余额',
  lens: r.compose($$,
                  r.prop('balance'))
},{
  name: '充值类型',
  lens: r.prop('channel')
},{
  name: '对方',
  lens: r.prop('name')
},{
  name: '订单号',
  lens: r.prop('orderNo')
},{
  name: '备注',
  lens: r.prop('remark')
},{
  name: '交易状态',
  lens: r.compose(status=><span className={r.view(lensStatusMap(status, 'color'))(statusMap)}>
    {r.view(lensStatusMap(status, 'text'))(statusMap)}
  </span>,
        r.prop('status'))
},{
  name: '充值时间',
  lens: r.compose(datef, r.prop('createdAt'))
}]

const channelCatergory = [
  {text: '支付宝', catergory: ['支付宝']},
  {text: '微信转账', catergory: ['微信', '微信公众号']},
  {text: '人工充值', catergory: ['现金','POS刷卡','其他','支票','账扣','冲正']},
]
const channelFilter = {
  '': {text: '全部类型'},
  '支付宝': { text:'支付宝'},
  '微信转账': {text: '微信'},
  '微信公众号': { text: '微信公众号'},
  '人工充值': { text: '人工充值'},
}

export default function View(props){
  let searched = props.query? props.fuse.search(props.query): props.topup
  let filtered = searched.filter(data =>{
    let createdAt = Date.parse(r.prop('createdAt')(data))
    let status = r.path(['filters', 'status'], props)
    return createdAt > Date.parse(r.path(['filters', 'from'], props)) &&
           (createdAt - 0) < (Date.parse(r.path(['filters', 'to'], props)) - 0 + aDay) &&
           (status=== '' || channelCatergory.find(c=> status in c.catergory))
  })

  let selected = filtered.find(p=> r.prop('id')(p) === props.auditId )

  let contextValue = {
    actions: Var,
    table: TopupTable,
    idLens: r.prop('orderNo'),
    statusLens: r.compose(r.equals("pending"), r.prop('status')),
    modalId: "auditing",
    channel: props.channel,
  }

  return (
    <Context.Provider value={contextValue}>
      <Confirm table={TopupTable} enable={props.auditEnable} data={selected} auditId={props.auditId} />

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
                <Filter from={props.filters.from} to={props.filters.to} statusMap={channelFilter} />
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
