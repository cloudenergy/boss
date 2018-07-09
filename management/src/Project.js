import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'

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
    project => (<div>
               <button type="button" className="btn btn-link" onClick={_=>console.log(project)}>
               管理
               </button>
               <button type="button" className="btn btn-link" onClick={_=>console.log(project)}>
               删除
               </button>
               </div>),
    r.view(r.lensPath(['project']))
  )
}]

export default class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [{
        project: {name: 'hehe'},
        roomCount: 100,
        userCount: 15,
        deviceCount:100,
        hehe:'hihi'
      }]
    }
  }
  componentDidMount() {
    Observable.ajax({url: `${API_URI}/v1.0/boss/projects`,crossDomain:true, withCredentials: true})
      .subscribe(({response})=>this.setState({projects: response}))
  }
  render() {
    return (
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
    )
  }
}
