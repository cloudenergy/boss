import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'

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
  name: '明细查看',
  lens: r.always(<button type="button" className="btn btn-link" onClick={e=>console.log(e)}>查看明细</button>)
}]

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
  name: '提现服务费',
  lens: r.view(r.lensPath(['']))
},{
  name: '到账金额',
  lens: r.view(r.lensProp(['meh']))
},{
  name: '操作后余额',
  lens: r.view(r.lensPath(['fundChannel', 'createdAt']))
},{
  name: '提交时间',
  lens: r.compose(x=>new Date(x).toLocaleString(),
                  r.view(r.lensPath(['createdAt'])))
},{
  name: '操作',
  lens: r.always(<button type="button" className="btn btn-link" onClick={e=>console.log(e)}>
                   审核
                 </button>)
}]

export default class Finance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      payChannel: [],
      withDraw: []
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/finance`,crossDomain:true, withCredentials: true})
      .subscribe(({response})=>this.setState(response))
  }
   render() {
     return (
       <div>
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
         <table className="table">
         <thead>
         <tr>
         {withDrawTable.map((col, i) =>(
           <th key={i} scope="col">{col.name}</th>
         ))}
       </tr>
         </thead>
         <tbody>
         {this.state.withDraw.map((project,index)=>(
           <tr key={index}>
             {withDrawTable.map((col,index)=>(
               <td key={index}>{col.lens(project)}</td>
             ))}
           </tr>
         ))}
       </tbody>
         </table>
         </div>
    )
  }
}
