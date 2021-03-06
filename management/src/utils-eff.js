import {API_URI} from './env'
import * as r from 'ramda'
import {Observable} from 'rxjs-compat'
import $ from 'jquery'

export function rest(url, opts) {
  let config = r.merge({url: `${API_URI}/v1.0/${url}`,
           crossDomain:true,
           withCredentials: true}, opts)
  return Observable
    .ajax(config)
    .catch(err => {
      console.error(err)
      switch (err.status) {
      case 401:
        window.location = "/login"
        break;
      default: throw err
      }
    })
}

export function modal(id, status) {
  $ && $('#' + id).modal(status)
}

export function $$(cent) {
  return (cent/100).toFixed(2)
}

export function now() {
  return new Date()
}
