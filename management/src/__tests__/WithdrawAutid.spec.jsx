import React from 'react';
import renderer from 'react-test-renderer';
import * as r from 'ramda'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AuditContext,createActionContext} from '../Context'
import {Observable} from 'rxjs-compat'
jest.mock('rxjs/ajax')

import WithdrawAudit from '../WithdrawAudit';
const {Context, Var} = AuditContext
Enzyme.configure({ adapter: new Adapter() })

const withdraw = {withDraw:[
  {
    "id": 2,
    "projectId": "6367598515924897792",
    "amount": 1000,
    "fundChannelId": 10,
    "operator": 15,
    "auditor": 0,
    "status": "DONE",
    "createdAt": "2018-03-19T07:12:37.000Z",
    "updatedAt": "2018-03-19T07:12:37.000Z",
    "deletedAt": null,
    "channel": {
      "id": 10,
      "flow": "pay",
      "projectId": "6367598515924897792",
      "category": "online",
      "tag": "alipay",
      "name": "赵",
      "status": "PASSED",
      "createdAt": "2018-03-19T06:33:17.000Z",
      "updatedAt": "2018-07-15T10:44:35.000Z",
      "deletedAt": null,
      "project": {
        "id": "6367598515924897792",
        "logoUrl": null,
        "name": "公寓",
        "address": null,
        "description": null,
        "telephone": null,
        "createdAt": "2017-06-08T02:49:51.000Z",
        "updatedAt": "2017-06-08T02:49:51.000Z",
        "deletedAt": null
      }
    }
  },
  {
    "id": 3,
    "projectId": "6367598515924897792",
    "amount": 1000,
    "fundChannelId": 10,
    "operator": 15,
    "auditor": 0,
    "status": "PROCESSING",
    "createdAt": "2018-03-19T07:12:40.000Z",
    "updatedAt": "2018-03-19T07:12:40.000Z",
    "deletedAt": null,
    "channel": {
      "id": 10,
      "flow": "pay",
      "projectId": "6367598515924897792",
      "category": "online",
      "tag": "alipay",
      "name": "赵",
      "status": "PENDING",
      "createdAt": "2018-03-19T06:33:17.000Z",
      "updatedAt": "2018-07-15T10:44:35.000Z",
      "deletedAt": null,
      "project": {
        "id": "6367598515924897792",
        "logoUrl": null,
        "name": "公寓",
        "address": null,
        "description": null,
        "telephone": null,
        "createdAt": "2017-06-08T02:49:51.000Z",
        "updatedAt": "2017-06-08T02:49:51.000Z",
        "deletedAt": null
      }
    }
  }]}

describe('<WithdrawAudit/>', ()=>{
  let subject
  beforeEach(()=>{
    subject = (<WithdrawAudit/>)
  })

  it('renders', () => {
    Observable.ajax.mockReturnValue(Observable.of({response: withdraw}))
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })


  it('trigger search', (done) => {
    let wrapper = mount(subject)
    Var.subscribe(actions => actions.case({
      Query: (str) => {
        expect(str).toBe('1.2')
        done()
      },
      _: done.fail
    }))
    wrapper.find('input[type="search"]').first().simulate('change', {target:{value:'1.2'}})
  })

})
