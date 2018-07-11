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
          [{name: '项目管理', value:'project'},
           {name: '账户管理', value:'account'},
           {name: '银行审核', value:'banking'},
           {name: '提现审核', value:'cashing'},
          ].map(({name, value}, key)=>(
            <li key={key} className="nav-item">
               <Link className="nav-link" routeName={value}>{name}</Link>
             </li>
           ))
        }
      </ul>
    </div>
  </nav>)
export default Nav
