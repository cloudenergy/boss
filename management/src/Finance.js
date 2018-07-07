import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'

const tableColumns = [{
  name: '项目名称',
  lens: r.lensPath(['fundChannel', 'project', 'name'])
},{
  name: '行卡号/支付宝账号',
  lens: r.lensPath(['account'])
},{
  name: '支行名称',
  lens: r.lensProp('subbranch')
},{
  name: '账户归属区域',
  lens: r.lensPath(['locate'])
},{
  name: '审核',
  lens: r.lensProp(['fundChannel', 'status'])
},{
  name: '申请时间',
  lens: r.lensPath(['fundChannel', 'createdAt'])
},{
  name: '明细查看',
  lens: r.lensPath(['project', 'description'])
}]

export default class Finance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      payChannel: [{
        project: {name: 'hehe'},
        roomCount: 100,
        userCount: 15,
        deviceCount:100,
        hehe:'hihi'
      }]
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/finance`,crossDomain:true, withCredentials: true})
      .subscribe(({response})=>this.setState({payChannel: response}))
  }
   render() {
    return (
      <table className="table">
        <thead>
          <tr>
            {tableColumns.map((col, i) =>(
              <th key={i} scope="col">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {this.state.payChannel.map((project,index)=>(
          <tr key={index}>
            {tableColumns.map(col=>(
              <td>{r.view(col.lens, project)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}
