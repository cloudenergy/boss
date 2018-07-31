import React from 'react';
import renderer from 'react-test-renderer';
import * as r from 'ramda'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AuditContext,createActionContext} from '../Context'
import {Observable} from 'rxjs-compat'
jest.mock('rxjs/ajax')
jest.mock('../utils')
import Fuse from 'fuse.js'
import WithdrawAudit from '../WithdrawAudit';
import View from '../WithdrawAudit.view.jsx'
import reducer from '../WithdrawAudit.reducer.jsx'
const {Context, Var} = AuditContext
Enzyme.configure({ adapter: new Adapter() })

const data = {withDraw:[
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
      "name": "张",
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
    "createdAt": "2018-07-19T07:12:40.000Z",
    "updatedAt": "2018-09-19T07:12:40.000Z",
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
        "createdAt": "2017-07-08T02:49:51.000Z",
        "updatedAt": "2017-06-08T02:49:51.000Z",
        "deletedAt": null
      }
    }
  }]}

describe('<WithdrawAudit/>', ()=>{
  let subject, state= {
    withDraw: [],
    auditId: '',
    fund: {},
    user: {},
    filters:{
      from: '2018-07-01',
      to: '2018-07-28',
      status: ''
    },
    summary: {
      sum: 0,
      withdraw: 0,
      fee:0,
      balance:0,
    },
    auditEnable: true,
    query: "",
    fuse: new Fuse([], {})
  }

  beforeEach(()=>{
    subject = (<View {...state} withDraw={data.withDraw} />)
  })

  it('renders', () => {
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })


  /* it('trigger search', () => {
   *   let wrapper = mount(subject)

   *   jest.runAllTimers();
   *   console.log(wrapper.find('table tr').text())
   *   expect(wrapper.find('table tbody tr').length).toBe(2)
   *   wrapper.find('input[type="search"]').first().simulate('change', {target:{value:'赵'}})
   *   expect(wrapper.find('table tbody tr').length).toBe(1)
   * }) */
})
