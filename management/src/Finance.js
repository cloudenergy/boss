
import React from 'react'
import {Observable} from 'rxjs-compat'
import * as r from 'ramda'
import './Finance.css'
import fuseOptFrom from './fuseOpt'
import Fuse from 'fuse.js'
import datef from 'dateformat'
import {AuditAction} from './Action'
import {AuditContext} from './Context'
import Confirm from './audit/Confirm'
import Edit from './audit/Edit'
import Table from './audit/Table'
import {modal,rest} from './utils-eff'

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
    r.pathOr('',['locate', 'province'], x) + r.pathOr('',['locate', 'city'], x) + r.pathOr('',['locate', 'district'],x)
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
},{
  name: '操作',
  lens: r.compose(id=>(
    <button onClick={e=> {
      e.stopPropagation();
      modal('finance-edit', 'show')
      Var.next(AuditAction.Edit(id))
    }} className="btn btn-link">编辑</button>),
                  r.prop('fundChannelId'))
}]

const contextValue = {
  actions: Var,
  table:payChannelTable,
  idLens: r.view(r.lensPath(['fundChannel', 'id'])),
  statusLens: r.compose(r.equals("PENDING"), r.view(r.lensPath(['fundChannel', 'status']))),
  modalId: "auditing",
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
      Edit: (id) => Observable.of(this.setState({auditId: id})),
      Query: (str) => Observable.of(this.setState({query: str})),
      Approve: id => rest(`boss/fundChannels/${id}/status`, {
        method: 'PUT',
        body: {status: 'PASSED'},
      }).do(()=>Var.next(AuditAction.Load)),
      Deny: id => rest(`boss/fundChannels/${id}/status`, {
        method: 'PUT',
        body: {status: 'DENY'},
      }).do(()=>Var.next(AuditAction.Load)),
      Update: (form, originalData)=> {
        let payChannel = {
          account: form.get('account'),
          linkman: form.get('linkman')||'',
          subbrach: form.get('subbrach'),
          locate: {
            province: form.get('province'),
            city: form.get('city'),
            district: form.get('district'),
          }
        }
        let fundChannel = {
          name: form.get('name')
        }
        return Observable.zip(
          rest(`boss/fundChannels/${originalData.fundChannelId}`, {
            method: 'PUT',
            body: fundChannel,
          }),
          rest(`boss/payChannels/${originalData.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: payChannel,
          })
        ).do(()=>Var.next(AuditAction.Load))
      },
    })).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    let filtered = this.state.query? this.state.fuse.search(this.state.query): this.state.payChannel
    let selected = filtered.find(p=> r.path(['fundChannel', 'id'])(p)=== this.state.auditId )
    let editingTable = r.equals('alipay', r.path(['fundChannel', 'tag'], selected))?[
      {name: '账号类型',
       lens: r.always('支付宝'),
       disabled: true,
       key: 'tag',
      },
      {
        name: '账户名',
        lens: r.view(r.lensPath(['fundChannel','name'])),
        key: 'name',
      },{
        name: '支付宝账号',
        lens: r.view(r.lensPath(['account'])),
        key: 'account'
      },{
        name: '姓名',
        lens: r.view(r.lensProp('linkman')),
        key: 'linkman',
      }
    ]:[{
      name: '账号类型',
      lens: r.always('银行卡'),
      disabled: true,
      key: 'tag'
    },{
      name: '账户名',
      lens: r.view(r.lensPath(['fundChannel','name'])),
      key: 'name'
    },{
      name: '银行卡号',
      lens: r.view(r.lensPath(['account'])),
      key: 'account'
    },{
      name: '支行名称',
      lens: r.view(r.lensProp('subbranch')),
      key: 'subbranch'
    },{ name: '省',
        lens: r.path(['locate', 'province']),
        key: 'province',
    },
       { name: '城市',
         lens: r.path(['locate', 'city']),
         key: 'city',
       },{ name: '地区',
           lens: r.path(['locate', 'district']),
           key:'district'
    }]
    return (
      <Context.Provider value={contextValue}>
        <Confirm enable={this.state.auditEnable} data={selected} auditId={this.state.auditId} />
        <Edit modalId="finance-edit" data={selected} table={editingTable} auditId={this.state.auditId} />
        <div className="accordion" id="banking-audit">
          <div className="card">
            <div className="card-header bg-info">
              <h5 className="mb-0">
                银行卡审核
              </h5>
            </div>
            <div>
              <div className="card-body">
                <div className="form-group">
                  <input className="form-control col-2" type="search" placeholder="搜索" aria-label="Search" onChange={e=> Var.next(AuditAction.Query(e.target.value))} />
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
