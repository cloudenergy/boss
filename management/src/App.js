import React from 'react';
import './App.css';
import Nav from './Nav'
import Project from './Project'
import Finance from './Finance'
import FinanceWithdraw from './FinanceWithdraw'

function Page({route}) {
  if(!route) { return <h1>404</h1>}
  switch(route.name) {
  case 'project': return <Project/>
  case 'account': return <h1>Account</h1>
  case 'banking': return <Finance/>
  case 'cashing': return <FinanceWithdraw/>
  default: return <h1>404</h1>
  }}

function App({route}) {
  return <div>
    <Nav/>
    <Page route={route}/>
    </div>
}

export default App;
