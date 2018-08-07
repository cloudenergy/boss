import React from 'react';
import renderer from 'react-test-renderer';
import * as r from 'ramda'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AuditContext,createActionContext} from '../Context'
import {Observable} from 'rxjs-compat'
import {rest, now} from '../utils.js'
jest.mock('../utils')
import Fuse from 'fuse.js'
import WithdrawAudit from '../WithdrawAudit';
import WithdrawView from '../WithdrawAudit.view.jsx'
import TopupView from '../Topup.view.jsx'
import reducer from '../WithdrawAudit.reducer.jsx'
const {Context, Var} = AuditContext
Enzyme.configure({ adapter: new Adapter() })
now.mockReturnValue(new Date('2018-07-28'))
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
rest.mockImplementation(url=>{
  switch(url){
    case "environments": return Observable.of({response: [{key:'user', id: 123}]});
    case 'boss/incomeSummary': return Observable.of({response:{"sum":14409,"withdraw":0,"fee":0,"arrears":[{"value":"-394404","count":11}],"frozen":400,"balance":13922.546}});
    case 'boss/withDraw': return Observable.of({response:{"withDraw":[{"id":3,"projectId":"6376305154160988160","amount":400,"fundChannelId":26,"operator":"6413312023169470466","auditor":0,"status":"PENDING","createdAt":"2018-07-26T13:24:02.000Z","updatedAt":"2018-07-26T13:24:02.000Z","deletedAt":null,"auth":null,"channel":{"id":26,"flow":"pay","projectId":"6376305154160988160","category":"online","tag":"alipay","name":"丁新城","status":"PASSED","createdAt":"2018-07-18T12:49:52.000Z","updatedAt":"2018-07-20T12:21:36.000Z","deletedAt":null,"project":{"id":"6376305154160988160","logoUrl":null,"name":"测试项目","address":null,"description":null,"telephone":null,"createdAt":"2018-03-05T06:00:23.000Z","updatedAt":"2018-03-05T06:00:27.000Z","deletedAt":null}}},{"id":2,"projectId":"6376305154160988160","amount":1000,"fundChannelId":26,"operator":"6413312023169470466","auditor":"6413312023169470466","status":"PROCESSFAILURE","createdAt":"2018-07-26T13:05:45.000Z","updatedAt":"2018-07-26T13:17:56.000Z","deletedAt":null,"auth":{"id":"6413312023169470466","level":"OP","username":"dxcpuls","password":"c33cc8e44b724bfa0bae09dbc946f8d7","email":"","mobile":null,"allowReceiveFrom":"BOTH","lastLoggedIn":null,"createdAt":"2018-03-05T06:01:03.000Z","updatedAt":"2018-03-05T06:01:05.000Z","deletedAt":null,"projectId":"6376305154160988160"},"channel":{"id":26,"flow":"pay","projectId":"6376305154160988160","category":"online","tag":"alipay","name":"丁新城","status":"PASSED","createdAt":"2018-07-18T12:49:52.000Z","updatedAt":"2018-07-20T12:21:36.000Z","deletedAt":null,"project":{"id":"6376305154160988160","logoUrl":null,"name":"测试项目","address":null,"description":null,"telephone":null,"createdAt":"2018-03-05T06:00:23.000Z","updatedAt":"2018-03-05T06:00:27.000Z","deletedAt":null}}},{"id":1,"projectId":"6376305154160988160","amount":1000,"fundChannelId":26,"operator":"6413312023169470466","auditor":"6413312023169470466","status":"PROCESSFAILURE","createdAt":"2018-07-26T13:03:46.000Z","updatedAt":"2018-07-26T13:17:57.000Z","deletedAt":null,"auth":{"id":"6413312023169470466","level":"OP","username":"dxcpuls","password":"c33cc8e44b724bfa0bae09dbc946f8d7","email":"","mobile":null,"allowReceiveFrom":"BOTH","lastLoggedIn":null,"createdAt":"2018-03-05T06:01:03.000Z","updatedAt":"2018-03-05T06:01:05.000Z","deletedAt":null,"projectId":"6376305154160988160"},"channel":{"id":26,"flow":"pay","projectId":"6376305154160988160","category":"online","tag":"alipay","name":"丁新城","status":"PASSED","createdAt":"2018-07-18T12:49:52.000Z","updatedAt":"2018-07-20T12:21:36.000Z","deletedAt":null,"project":{"id":"6376305154160988160","logoUrl":null,"name":"测试项目","address":null,"description":null,"telephone":null,"createdAt":"2018-03-05T06:00:23.000Z","updatedAt":"2018-03-05T06:00:27.000Z","deletedAt":null}}}]}})
    case 'boss/topup': return Observable.of({response:[{
      amount: 10000,
      fee: 10,
      balance: 1000,
      channel: '支付宝',
      name: 'hehe',
      orderNo: 123123,
      createdAt: '2018-03-05T06:00:23.000Z',
      remark: '备注'
    }]})
  }

})
describe('<WithdrawAudit/>', ()=>{
  let subject, state= {
    withDraw: data.withDraw,
    topup:[{
      amount: 10000,
      fee: 10,
      balance: 1000,
      channel: '支付宝',
      name: 'hehe',
      orderNo: 123123,
      createdAt: '2018-03-05T06:00:23.000Z',
      remark: '备注'
    }],
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

  })

  it('renders <WithdrawView />', () => {
    subject = (<WithdrawView {...state} />)
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })

  it('renders <WithDrawAudit />', ()=> {
    subject = (<WithdrawAudit/>)
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })

  it('render <TopupView/>', () => {
    subject = (<TopupView {...state} channel="topup"  />)
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })

  it('render <TopupView/>', () => {
    subject = (<TopupView {...state} channel="topup" filters={{from:"2018-03-02", to:"2018-03-05"}} />)
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })

  it('Action Load', (done) => {
    let setState = jest.fn()
    reducer(setState, state).take(4).toArray().subscribe(x=>{
      expect(setState.mock.calls.length).toEqual(4)
      done()
    },err=>console.log(err))
  })


})
