import React from 'react'
import {Observable} from 'rxjs-compat'
import {API_URI} from './env'
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
  }
  render() {
    return (
      <div>Hi</div>
    )
  }
}
