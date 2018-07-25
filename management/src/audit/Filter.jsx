import React from 'react'
import {AuditAction} from '../Action'
import {AuditContext} from '../Context'

const {Context} = AuditContext

const Filter = (props) => (
  <Context.Consumer>{({table, actions, modalId})=>(
    <div>
      <input type="date" name="from" defaultValue={props.from} onChange={e=>actions.next(AuditAction.Filters({from: e.target.value})) } />
      <input type="date" name="to" defaultValue={props.to} onChange={e=>actions.next(AuditAction.Filters({to: e.target.value})) }/>
    </div>
  )}
  </Context.Consumer>
)

export default Filter
