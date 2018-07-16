import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'
import {createActionContext} from './Context'
import * as Type from 'union-type'

function isProject(project) {
  return project && project.id && project.name
}

const ProjectAction = Type({Modify:[isProject], Delete:[String]})
const {Context: ProjectContext, Var} = createActionContext()

const tableColumns = [{
  name: '项目名称',
  lens: r.view(r.lensPath(['project', 'name']))
},{
  name: '房间数量',
  lens: r.view(r.lensPath(['roomCount']))
},{
  name: '账号数量',
  lens: r.view(r.lensProp('userCount'))
},{
  name: '仪表数量',
  lens: r.view(r.lensPath(['deviceCount']))
},{
  name: '入住数量',
  lens: r.view(r.lensProp('activeCount'))
},{
  name: '描述',
  lens: r.view(r.lensPath(['project', 'description']))
},{
  name: '操作',
  lens: r.compose(
    project => (<ProjectContext.Consumer>{actions=>(
      <div>
      <button type="button" className="btn btn-link" onClick={_=>actions.next(ProjectAction.Modify(project))}>
        管理
      </button>
      <button type="button" className="btn btn-link" onClick={_=>actions.next(ProjectAction.Delete(project.id))}>
        删除
      </button>
      </div>
    )}

               </ProjectContext.Consumer>),
    r.view(r.lensPath(['project']))
  )
}]

export default class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: []
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/projects`,crossDomain:true, withCredentials: true})
      .subscribe(({response})=>this.setState({projects: response}))

    Var.flatMap(action => action.case({
      Modify: (project) => Observable.ajax({url: `${API_URI}/v1.0/boss/projects/${project.id}`,
                                           method: 'PUT',
                                           crossDomain:true,
                                           withCredentials: true,
                                           body:project
                                          }),
      Delete: (id) => Observable.ajax({url: `${API_URI}/v1.0/boss/projects/${id}`,
                                      method: 'DELETE',
                                      crossDomain:true,
                                      withCredentials: true
                                      })
    }))
      .subscribe()
  }
  render() {
    return (
      <ProjectContext.Provider value={Var}>
      <table className="table">
        <thead>
          <tr>
            {tableColumns.map((col, i) =>(
              <th key={i} scope="col">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {this.state.projects.map((project,index)=>(
          <tr key={index}>
            {tableColumns.map((col,index)=>(
                <td key={index}>{col.lens(project)}</td>
            ))}
          </tr>
        ))}
        </tbody>
        </table>
       </ProjectContext.Provider>
    )
  }
}
