import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'

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

export default class FinanceWithdraw extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
         <div className="accordion">
           <div className="card">
             <div className="card-header bg-info" id="cashing-audit-title">
               <h5 className="mb-0">
                 提现审核
               </h5>
             </div>
             <div>
               <div className="card-body">
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
             </div>

           </div>
         </div>

       </div>
    )
  }
}
