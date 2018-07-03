import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ActionContext} from './Context'
function App({route}) {
  if(!route) { return null}
  switch(route.name) {
  case 'home': return <h1>Home</h1>
  case 'profile': return <h1>Account</h1>
  }
}

export default App;
