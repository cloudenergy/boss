import {AuditAction} from '../Action'
import React from 'react'
import {AuditContext} from '../Context'
import $ from 'jquery'
const {Context} = AuditContext
const Table = ({data, title}) => (
  <Context.Consumer>{({table, actions, modalId, idLens, statusLens, color})=>(
    <div className="accordion" id="banking-audit">
      <div className="card">
        <div className={"card-header " + color}>
          <h5 className="mb-0">
            {title}
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
                    <tr data-toggle="modal" key={index} onClick={()=>{
                        actions.next(AuditAction.Popup(idLens(project), statusLens(project)))
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
