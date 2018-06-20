const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const loginForm = q('#form-signin')
const r = require('ramda')

Observable.fromEvent(loginForm, 'submit')
  .do(e=>e.preventDefault())
  .mergeMap(()=>Observable.ajax({
    url: 'http://127.0.0.1:8000/v1.0/login',
    crossDomain: true,
    responseType: 'json',
    method: 'POST',
    body: {
      username: 'admin100',
      password: '5f4dcc3b5aa765d61d8327deb882cf99',
    }
  }))
  .subscribe((result) => {
    let lensSuccess = r.lensPath(['response', 'code'])
    if(r.view(lensSuccess, result) == 0) {
      window.location = '/dashboard'
    }
  },(error) =>{
    console.error(error)
  })
