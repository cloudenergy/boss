import React from 'react'
import {AuditAction} from '../Action'
import {AuditContext} from '../Context'
import * as r from 'ramda'
const {Context} = AuditContext

const Filter = (props) => (
  <Context.Consumer>{({table, actions, modalId, channel})=>(
    <div className="col-6">
      <input className="col-3" type="date" name="from" defaultValue={props.from} onChange={e=>{
          actions.next(AuditAction.Range({from: e.target.value}))
      } } required />
      <input className="col-3" type="date" name="to" defaultValue={props.to} onChange={e=>{
          actions.next(AuditAction.Range({to: e.target.value}))
      } } required/>
      <select className="col-3" onChange={e=> actions.next(AuditAction.Filters({status: e.target.value})) }>
        <option value="">全部状态</option>
        {r.toPairs(props.statusMap).map(([key, val], index)=>(
          <option key={index} value={key}>{val.text}</option>
        ))}
      </select>
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className={"btn btn-primary" + (channel==="withdraw" ? ' active': '')} onClick={e=>{
            actions.next(AuditAction.Switch("withdraw"))
        }}>
          <input type="radio" name="withdraw" autoComplete="off" defaultChecked={channel==="withdraw"} /> 支出
        </label>
        <label className={"btn btn-primary" + (channel==="topup" ? ' active': '')} onClick={e=>actions.next(AuditAction.Switch("topup"))}>
          <input type="radio" name="topup" autoComplete="off" defaultChecked={channel==="topup"} /> 收入
        </label>
      </div>
    </div>
  )}
  </Context.Consumer>
)

export default Filter
