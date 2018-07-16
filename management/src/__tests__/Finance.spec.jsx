import React from 'react';
import renderer from 'react-test-renderer';
import * as r from 'ramda'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AuditContext,createActionContext} from '../Context'
import {Observable} from 'rxjs-compat'
jest.mock('rxjs/ajax')

import Finance from '../Finance';
const {Context} = AuditContext
Enzyme.configure({ adapter: new Adapter() })

const payChannel = {"payChannel":[{"locate":null,"id":2,"fundChannelId":11,"documentId":null,"documentType":1,"account":"123@gmail.com","subbranch":"","reservedmobile":"","linkman":"heheda","mobile":"","createdAt":"2018-05-28T05:59:01.000Z","updatedAt":"2018-05-28T05:59:01.000Z","deletedAt":null,"fundChannel":{"id":11,"flow":"pay","projectId":"999999999","category":"online","tag":"alipay","name":"heheda","status":"PASSED","createdAt":"2018-05-28T05:59:01.000Z","updatedAt":"2018-07-13T13:44:08.000Z","deletedAt":null,"project":{"id":"888888","logoUrl":null,"name":"杭州海兴电力科技股份有限公司","address":null,"description":null,"telephone":null,"createdAt":"2018-04-24T10:25:32.000Z","updatedAt":"2018-04-24T10:25:34.000Z","deletedAt":null}}},{"locate":null,"id":3,"fundChannelId":12,"documentId":null,"documentType":1,"account":"000000000","subbranch":"","reservedmobile":"","linkman":"dddddd","mobile":"","createdAt":"2018-06-07T06:09:39.000Z","updatedAt":"2018-06-07T06:09:39.000Z","deletedAt":null,"fundChannel":{"id":12,"flow":"pay","projectId":"77777777","category":"online","tag":"alipay","name":"xxxxxxx","status":"PASSED","createdAt":"2018-06-07T06:09:39.000Z","updatedAt":"2018-07-13T13:44:10.000Z","deletedAt":null,"project":{"id":"33333333","logoUrl":null,"name":"测试项目","address":null,"description":null,"telephone":null,"createdAt":"2018-03-05T06:00:23.000Z","updatedAt":"2018-03-05T06:00:27.000Z","deletedAt":null}}}]}

describe('<Finance/>', ()=>{
  let subject
  beforeEach(()=>{
    subject = (<Finance/>)
  })

  it('renders', () => {
    Observable.ajax.mockReturnValue(Observable.of({response: payChannel}))
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })
})
