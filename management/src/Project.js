import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
import * as r from 'ramda'

const tableColumns = [{
  name: '项目名称',
  lens: r.lensPath(['project', 'name'])
},{
  name: '房间数量',
  lens: r.lensPath(['roomCount'])
},{
  name: '账号数量',
  lens: r.lensProp('userCount')
},{
  name: '仪表数量',
  lens: r.lensPath(['deviceCount'])
},{
  name: '入住数量',
  lens: r.lensProp('hehe')
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
            {tableColumns.map(col=>(
              <td>{r.view(col.lens, project)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}
