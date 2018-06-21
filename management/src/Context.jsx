import React from 'react'
import { Subject } from 'rxjs-compat'

export const ActionContext = React.createContext(new Subject());
