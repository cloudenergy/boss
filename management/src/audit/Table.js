import {AuditAction} from '../Action'
import React from 'react'
import {AuditContext} from '../Context'
import * as r from 'ramda'

const {Context} = AuditContext
const Table = ({data}) => (
  <Context.Consumer>{({table, actions, modalId})=>(
    <div className="accordion" id="banking-audit">
      <div className="card">
        <div className="card-header bg-warning">
          <h5 className="mb-0">
            银行卡审核
          </h5>
        </div>
        <div>
          <div className="card-body">
            <div className="form-group">
              <input className="form-control col-2" type="search" placeholder="搜索" aria-label="Search" onChange={e=> actions.next(AuditAction.Query(e.target.value))} />
            </div>
            <table className="table table-hover">
              <thead className="sticky-top">
                <tr>
                  {
                    table.map((col, i) =>(
                      <th key={i} scope="col">{col.name}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  data.map((project,index)=>(
                    <tr data-toggle="modal" data-target={'#'+modalId} key={index} onClick={()=>{
                        let id = r.view(r.lensPath(['fundChannel', 'id']), project)
                        let status = r.view(r.lensPath(['fundChannel', 'status']), project) === "PENDING"
                        actions.next(AuditAction.Popup(id, status))
                    }}>
                      {table.map((col,index)=>(
                        <td key={index}>{col.lens(project)}</td>
                      ))}
                    </tr>
                  ))
                }

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )}
  </Context.Consumer>
)
export default Table
