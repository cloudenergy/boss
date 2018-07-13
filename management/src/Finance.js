import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'
import './Finance.css'
import {createActionContext} from './Context'
import * as Type from 'union-type'
import logo from './logo.png'
import fuseOptFrom from './fuseOpt'
import Fuse from 'fuse.js'
import datef from 'dateformat'

const fuseOpt = fuseOptFrom(['fundChannel.project.name', 'account', 'subbranch', 'locate', 'fundChannel.status'])

const BankingAction = Type({Approve:[Number], Deny:[Number], Popup:[Number, Boolean]})

const {Context, Val} = createActionContext()

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
  lens: r.compose(status=><span className={r.view(lensStatusMap(status, 'color'))(statusMap)}>{r.view(lensStatusMap(status, 'text'))(statusMap)}</span>,
                  r.view(r.lensPath(['fundChannel', 'status'])))
},{
  name: '申请时间',
  lens: r.compose(x=>datef(Date.parse(x), 'yyyy年mm月dd日 HH:MM'),
                  r.view(r.lensPath(['fundChannel', 'createdAt'])))
}]

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
    const loadData = this._loadData.bind(this)
    loadData()

    Val.flatMap(action => action.case({
      Popup: (id,status) => Observable.of(this.setState({auditId: id, auditEnable: status})),
      Approve: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'PASSED'},
        crossDomain:true,
        withCredentials: true}).map(loadData),
      Deny: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'DENY'},
        crossDomain:true,
        withCredentials: true}).map(loadData)
    })).subscribe()
  }
  _loadData() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/finance`,crossDomain:true, withCredentials: true})
              .subscribe(({response})=>this.setState({
                payChannel: response.payChannel,
                fuse: new Fuse(response.payChannel, fuseOpt)
              }))
  }
  render() {
    let filtered = this.state.query? this.state.fuse.search(this.state.query): this.state.payChannel
    return (
      <div>
        <Confirm
          enable={this.state.auditEnable}
          banking={filtered.filter(p=> r.path(['fundChannel', 'id'])(p)=== this.state.auditId )} />
        <div className="accordion" id="banking-audit">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="mb-0">
                银行卡审核
              </h5>
            </div>
            <div>
              <div className="card-body">
                <div class="form-group">
                  <input className="form-control col-2" type="search" placeholder="搜索" aria-label="Search" onChange={e=> this.setState({query: e.target.value})} />
                </div>
                <table className="table table-hover">
                  <thead className="sticky-top">
                    <tr>
                      {payChannelTable.map((col, i) =>(
                        <th key={i} scope="col">{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <Context.Consumer>{action=>(
                      filtered.map((project,index)=>(
                        <tr data-toggle="modal" data-target="#audit-banking" key={index} onClick={()=>{
                            let id = r.view(r.lensPath(['fundChannel', 'id']), project)
                            let status = r.view(r.lensPath(['fundChannel', 'status']), project) === "PENDING"
                            action.next(BankingAction.Popup(id, status))
                        }}>
                          {payChannelTable.map((col,index)=>(
                            <td key={index}>{col.lens(project)}</td>
                          ))}
                        </tr>
                      ))
                    )}
                    </Context.Consumer>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const firstId = r.lensPath(['0','fundChannel','id'])

const Confirm = (props) => (
  <div className="modal" id="audit-banking" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" aria-label="Close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body container">
          <div className="row">
            <div className="col-3">
              <img alt="logo" src={logo} />
            </div>
            <div className="col-9">
              <ul className="audit-content">
                {r.take(6)(payChannelTable).map((col,index)=>(
                  <li key={index}>{col.name}: {col.lens(props.banking[0])}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Context.Consumer>{action=>(
          <div className="modal-footer">
            <button type="button" disabled={!props.enable} className="btn btn-success" data-dismiss="modal" onClick={()=>{
                action.next(BankingAction.Approve(r.view(firstId, props.banking)))
            }}>
              确认审核
            </button>
            <button type="button" disabled={!props.enable} className="btn btn-danger" data-dismiss="modal" onClick={()=>{
                console.log(props.banking)
                action.next(BankingAction.Deny(r.view(firstId, props.banking)))
            }}>审核失败</button>
          </div>
        )}
        </Context.Consumer>
      </div>
    </div>
  </div>
)
