import React from 'react'
import './Finance.css'
import fuseOptFrom from './fuseOpt'
import Fuse from 'fuse.js'
import dateformat from 'dateformat'
import {now} from './utils'
import reducer from './WithdrawAudit.reducer'
import WithdrawView from './WithdrawAudit.view'
import TopupView from './Topup.view'

const fuseOpt = fuseOptFrom(['channel.project.name', 'channel.name', 'createdAt'])

export default class WithdrawAudit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      withDraw: [],
      topup: [],
      auditId: '',
      fund: {},
      channel: 'withdraw',
      user: {},
      filters:{
        from: dateformat(now(), 'yyyy-mm-') + '01',
        to: dateformat(now(), 'yyyy-mm-dd'),
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
      withdrawFuse: new Fuse([], withDrawFuseOpt),
      topupFuse: new Fuse([], topupFuseOpt),
    }
  }
  componentDidMount() {
    this.subscription = reducer(this.setState.bind(this), this.state).subscribe()
  }
  componentWillUnmount(){
    this.subscription.unsubscribe()
  }
  render() {
    return this.state.channel==='withdraw'?<WithdrawView {...this.state} />:
           <TopupView {...this.state} />
  }
}