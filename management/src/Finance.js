import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'
import './Finance.css'

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
      withDraw: [],
      display:{
        cashing: 'show',
        banking: 'show',
      },
      height: {
        cashing: '300px',
        banking: '300px'
      },
      expand: false
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/finance`,crossDomain:true, withCredentials: true})
      .subscribe(({response})=>this.setState(response))
  }
   render() {
     return (
       <div>
         <div className="accordion" id="banking-audit">
           <div className="card">
             <div className="card-header bg-warning" id="banking-audit-title"  onClick={_=>{
                 this.setState({display:{banking: 'show'},
                                height:{banking: '700px'}})
               }}>
               <h5 className="mb-0">
                   银行卡审核
               </h5>
             </div>
             <div id="collapseOne" className={"collapse " + this.state.display.banking} aria-labelledby="banking-audit-title" data-parent="#banking-audit">
               <div className="card-body" style={{height: this.state.height.banking}}>
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
         <div className="mx-auto" style={{width: '100px'}}>
         <button type="button" className="btn btn-link" onClick={() => this.setState(s=>{
           let height = s.expand ? {cashing: '300px', banking:'300px'}: {cashing: '100px', banking: '500px'}
           return {expand: !s.expand, height,
                   display:{
                     cashing: 'show',
                     banking: 'show',
                   }}
         })}>
         {this.state.expand?'收起':'展开'}
       </button>
         </div>
         </div>

       </div>
         </div>
<div className="accordion" id="cashing-audit">
           <div className="card">
         <div className="card-header bg-info" id="cashing-audit-title" onClick={_=>{
           this.setState({display:{cashing: 'show'},
                          height:{cashing: '700px'}})
         }}>
               <h5 className="mb-0">
                   提现审核
               </h5>
             </div>
             <div id="cashing-audit-body" className={"collapse " + this.state.display.cashing} aria-labelledby="cashing-audit-title" data-parent="#cashing-audit">
               <div className="card-body" style={{height: this.state.height.cashing}}>
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
