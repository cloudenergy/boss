import {API_URI} from './env'
import * as r from 'ramda'
import {Observable} from 'rxjs-compat'

export function rest(url, opts) {
  let config = r.merge({url: `${API_URI}/v1.0/${url}`,
           crossDomain:true,
           withCredentials: true}, opts)
  return Observable
    .ajax(config)
    .catch(err => {
      switch (err.status) {
      case 401:
        window.location = "/login"
        break;
      default: throw err
      }
    })
}

export function modal(name, status) {
  window.$ && window.$(name).modal(status)
}
