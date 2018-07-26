import {AuditAction} from '../Action'
import React from 'react'
import {AuditContext} from '../Context'
import {modal} from '../utils'

const {Context} = AuditContext
const Table = ({data}) => (
  <Context.Consumer>{({table, actions, modalId, idLens, statusLens})=>(
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
                      modal(modalId, 'show')
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
  )}
  </Context.Consumer>
)
export default Table
