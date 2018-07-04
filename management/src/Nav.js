import React from 'react'
import { Link } from 'react-router5'
const Nav = (props) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <a className="navbar-brand" href="/dashboard">BOSS</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        {
          [{name: 'Project', value: 'project'},
           {name: 'Account', value:'account'}
          ].map(({name, value}, key)=>(
            <li key={key} className="nav-item">
               <Link className="nav-link" routeName={name}>{value}</Link>
             </li>
           ))
        }
      </ul>
    </div>
  </nav>)
export default Nav
