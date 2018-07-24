import {AuditAction} from '../Action'
import React from 'react'
import logo from '../logo.png'
import {AuditContext} from '../Context'
const {Context} = AuditContext

const Confirm = (props) => (
  <Context.Consumer>{({table, actions, modalId})=>(
    <div className="modal" id={modalId} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" aria-label="Close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body container">
            <div className="row">
              <div className="col-3">
                <img alt="logo" src={logo} style={{width: '160px'}} />
              </div>
              <div className="col-9 border-left">
                {(props.table?props.table:table).map((col,index)=>(
                  <dl key={index} className="row">
                    <dt className="col-4">{col.name}:</dt>
                    <dd className="col-8">{col.lens(props.data)}</dd>
                  </dl>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" disabled={!props.enable} className="btn btn-success" data-dismiss="modal" onClick={()=>{
                actions.next(AuditAction.Approve(props.auditId))
            }}>
              确认审核
            </button>
            <button type="button" disabled={!props.enable} className="btn btn-danger" data-dismiss="modal" onClick={()=>{
                actions.next(AuditAction.Deny(props.auditId))
            }}>审核失败</button>
          </div>
        </div>
      </div>
    </div>
  )}
  </Context.Consumer>
)

export default Confirm
