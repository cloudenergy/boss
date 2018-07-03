import React from 'react'
import { Subject, Observable } from 'rxjs-compat'
import Action from './Action'
const A = new Subject()

Observable.fromEvent(window, 'hashchange')
          .do(e => A.next(Action.Nav(e.newURL)))
          .subscribe(c=>console.log(c))
A.subscribe(next=>console.debug('New Action:', next))
export const ActionContext = React.createContext(A);
