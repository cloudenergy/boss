import React from 'react'
import {AuditAction} from '../Action'
import {AuditContext} from '../Context'
import * as r from 'ramda'
const {Context} = AuditContext

const Filter = (props) => (
  <Context.Consumer>{({table, actions, modalId})=>(
    <div className="col-6">
      <input className="col-3" type="date" name="from" defaultValue={props.from} onChange={e=>actions.next(AuditAction.Filters({from: e.target.value})) } />
      <input className="col-3" type="date" name="to" defaultValue={props.to} onChange={e=>actions.next(AuditAction.Filters({to: e.target.value})) }/>
      <select className="col-3" onChange={e=> actions.next(AuditAction.Filters({status: e.target.value})) }>
        <option value="">全部状态</option>
        {r.toPairs(props.statusMap).map(([key, val], index)=>(
          <option key={index} value={key}>{val.text}</option>
        ))}
      </select>
    </div>
  )}
  </Context.Consumer>
)

export default Filter
