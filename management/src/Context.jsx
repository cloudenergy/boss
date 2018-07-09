import React from 'react'
import { Subject } from 'rxjs-compat'

export function createActionContext() {
  let A = new Subject()
  A.subscribe(
    next=>console.debug('new Action:', next),
    error => console.error('ERROR: ', error)
  )
  return {Context: React.createContext(A), Val: A}
}
