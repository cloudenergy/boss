import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ActionContext} from './Context'
import Nav from './Nav'

function Page({route}) {
  if(!route) { return <h1>404</h1>}
  switch(route.name) {
  case 'project': return <h1>Home</h1>
  case 'profile': return <h1>Account</h1>
  default: return <h1>404</h1>
  }}

function App({route}) {
  return <div>
    <Nav/>
    <Page route={route}/>
    </div>
}

export default App;
