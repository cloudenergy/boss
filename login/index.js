const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const loginForm = q('#form-signin')
const r = require('ramda')
const md5 = require('md5')

Observable.fromEvent(loginForm, 'submit')
  .do(e=>e.preventDefault())
  .mergeMap(e=>{
    let form = e.target
    let username = form.querySelector('#inputUserName').value
    let password = form.querySelector('#inputPassword').value
    return Observable.ajax({
      url: 'http://127.0.0.1:8000/v1.0/login',
      crossDomain: true,
      responseType: 'json',
      method: 'POST',
      body: {
        username,
        password: md5(password),
      }
    })
  })
  .subscribe((result) => {
    let lensSuccess = r.lensPath(['response', 'code'])
    if(r.view(lensSuccess, result) == 0) {
      window.location = '/dashboard'
    } else {
      let lensMessage = r.lensPath(['response', 'message'])
      window.alert(r.view(lensMessage, result))
    }
  },(error) =>{
    window.alert('哪里太对')
    console.error(error)
  })
