import React from 'react'
import { Subject, Observable } from 'rxjs-compat'
import Action from './Action'

export function createActionContext() {
  let A = new Subject()
  A.subscribe(
    next=>console.debug('new Action:', next),
    error => console.error('ERROR: ', error)
  )
  return  React.createContext(A)
}
