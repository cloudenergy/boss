import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'
import './Finance.css'
import {createActionContext} from './Context'
import * as Type from 'union-type'

const BankingAction = Type({Approve:[Number], Deny:[Number], Popup:[Number], Close: []})

const {Context, Val} = createActionContext()

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
  lens: r.compose(r.ifElse(r.equals('PASSED'), r.always('通过'), r.always('失败')),
                  r.view(r.lensPath(['fundChannel', 'status'])))
},{
  name: '申请时间',
  lens: r.compose(x=>new Date(x).toLocaleString(),
                  r.view(r.lensPath(['fundChannel', 'createdAt'])))
},{
  name: '操作',
  lens: ({fundChannel}) => (
    <Context.Consumer>{action=>(
      <button type="button" className="btn btn-link" onClick={e=>action.next(BankingAction.Popup(fundChannel.id))}>
        审核
      </button>
    )}
    </Context.Consumer>)
}]

export default class Finance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      payChannel: [],
      auditId: '',
      popup: 'none',
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/finance`,crossDomain:true, withCredentials: true})
              .subscribe(({response})=>this.setState(response))
    Val.flatMap(action => action.case({
      Popup: id => Observable.of(this.setState({auditId: id, popup: 'block'})),
      Close: () => Observable.of(this.setState({popup: 'none'})),
      Approve: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'PASSED'},
        crossDomain:true,
        withCredentials: true}),
      Deny: id => Observable.ajax({
        method: 'PUT',
        url: `${API_URI}/v1.0/boss/fundChannels/${id}/status`,
        body: {status: 'DENY'},
        crossDomain:true,
        withCredentials: true})
    })).subscribe()
  }
  render() {
    return (
      <div>
        <Confirm show={this.state.popup} banking={this.state.payChannel.filter(p=> p.fundChannel.id=== this.state.auditId )} />
        <div className="accordion" id="banking-audit">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="mb-0">
                银行卡审核
              </h5>
            </div>
            <div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      {payChannelTable.map((col, i) =>(
                        <th key={i} scope="col">{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.payChannel.map((project,index)=>(
                      <tr key={index}>
                        {payChannelTable.map((col,index)=>(
                          <td key={index}>{col.lens(project)}</td>
                        ))}
                      </tr>
                    ))}
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
  <div className="modal" tabindex="-1" role="dialog" style={{display: props.show}}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modal title</h5>
          <Context.Consumer>{action=>(
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=> action.next(BankingAction.Close)
            }>
              <span aria-hidden="true">&times;</span>
            </button>
          )}
          </Context.Consumer>
        </div>
        <div className="modal-body">
          <ul>
            {r.take(5)(payChannelTable).map((col,index)=>(
              <li key={index}>{col.lens(props.banking[0])}</li>
            ))}
          </ul>
        </div>
        <Context.Consumer>{action=>(
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>{
                action.next(BankingAction.Approve(r.view(firstId, props.banking)))
                action.next(BankingAction.Close)
            }}>
              通过审核
            </button>
            <button type="button" className="btn btn-secondary" onClick={()=>{
                console.log(props.banking)
                action.next(BankingAction.Deny(r.view(firstId, props.banking)))
                action.next(BankingAction.Close)
            }}>审核失败</button>
          </div>
        )}
        </Context.Consumer>
      </div>
    </div>
  </div>
)
