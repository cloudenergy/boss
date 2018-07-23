import {AuditAction} from '../Action'
import React from 'react'
import logo from '../logo.png'
import {AuditContext} from '../Context'
const {Context} = AuditContext
const Edit = (props) => (
  <Context.Consumer>{({table, actions, modalId})=>(
    <div className="modal" id={props.modalId} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" aria-label="Close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={(e)=>{
              e.preventDefault()
              let form = new FormData(e.target)
              actions.next(AuditAction.Update(form, props.data))
          }}>
            <div className="modal-body container">
              <div className="row">
                <div className="col-3">
                  <img alt="logo" src={logo} style={{width: '160px'}} />
                </div>
                <div className="col-9 border-left">
                  {props.table.map((col,index)=>(
                    <dl key={index} className="row">
                      <dt className="col-4">{col.name}:</dt>
                      <dd className="col-8">
                        <input name={col.key} disabled={col.disabled} defaultValue={col.lens(props.data)}/>
                      </dd>
                    </dl>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <input type="submit" className="btn btn-success" value="保存" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )}
  </Context.Consumer>
)

export default Edit
