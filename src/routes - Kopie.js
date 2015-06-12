'use strict'

import React from 'react'
import { Route, NotFoundRoute, DefaultRoute } from 'react-router'

import Objekt from './components/main/object/object.js'
import FourOhFour from './components/main/fourOhFour.js'
import Empty from './components/main/empty.js'
import S1 from './components/menu/tree/s1.js'
import S2 from './components/menu/tree/s2.js'
import S3 from './components/menu/tree/s3.js'
import S4 from './components/menu/tree/s4.js'
import Apphandler from './components/apphandler.js'

export default React.createClass({
  displayName: 'Router',

  render () {
    return (
      <Route name='start' path='/' handler={Apphandler}>
        <Route name='s1' path='/:s1' handler={S1}/>
        <Route name='s2' path='/:s1/:s2' handler={S2}/>
        <Route name='s3' path='/:s1/:s2/:s3' handler={S3}/>
        <Route name='s4' path='/:s1/:s2/:s3/:s4' handler={S4}/>
        <Route name='s5' path='/:s1/:s2/:s3/:s4/:s5' handler={Objekt}/>
        <DefaultRoute handler={Empty}/>
        <NotFoundRoute handler={FourOhFour}/>
      </Route>
    )
  }
})
