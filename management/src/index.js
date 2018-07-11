import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'
import {RouteProvider, Route} from 'react-router5'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const routes = [
  { name: 'project', path: '/project' },
  { name: 'account', path: '/account' },
  { name: 'event', path: '/event' },
  { name: 'cashing', path: '/cashing' },
  { name: 'banking', path: '/banking' },
]

const router = createRouter(routes)
      .usePlugin(browserPlugin({useHash: true}))

router.start()

ReactDOM.render(
  <RouteProvider router={router}>
    <Route>{({ route }) => <App route={route} />}</Route>
  </RouteProvider>,
  document.getElementById('root'))
registerServiceWorker()
