import React from 'react';
import Table from '../../audit/Table';
import renderer from 'react-test-renderer';
import * as r from 'ramda'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AuditContext} from '../../Context'
const {Context, Var} = AuditContext

Enzyme.configure({ adapter: new Adapter() })

describe('Table', ()=>{
  const tableLayout = [{
    name: 'property',
    lens: r.view(r.lensPath(['a', 'b']))
  },{
    name: 'property2',
    lens: r.view(r.lensPath(['c']))
  }]
  const data = [{
    a:{b:1.1},
    c:1.2
  },{
    a:{b:2.1},
    c:2.2
  }]
  let subject;
  beforeEach(()=>{
    subject = (<Context.Provider value={{actions: Var,
                                         table:tableLayout,
                                         modalId: "modalId",
                                         idLens: ()=>999,
                                         statusLens: ()=>false
    }}>
      <Table data={data} />
    </Context.Provider>)

  })

  it('renders a Table base on context', () => {
    expect(renderer.create(subject).toJSON()).toMatchSnapshot()
  })

  it('trigger popup', (done,fail) => {
    let wrapper = mount(subject)
    Var.subscribe(actions => actions.case({
      Popup: (id,status) => {
        expect(id).toBe(999)
        expect(status).toBe(false)
        done()
      },
      _: () => fail()
    }))
    wrapper.find('tbody tr').first().simulate('click')
  })

})
