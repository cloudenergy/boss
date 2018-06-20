require('whatwg-fetch')
const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const loginForm = q('#form-signin')
const md5 = require('md5')

Observable.fromEvent(loginForm, 'submit')
  .do(e=>e.preventDefault())
  .mergeMap(e=>{
    let form = e.target
    let username = form.querySelector('#inputUserName').value
    let password = form.querySelector('#inputPassword').value
    return Observable.from(fetch('http://localhost:8000/v1.0/login',{
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      username,
      password: md5(password),
      keepAlive:2
    })
  }))
  })
  .do(()=>loginModal.set({show: false}))
  .subscribe(() => console.log('Logged in'));
