import React, { useEffect } from 'react'
import {Provider} from 'react-redux'

import Routers from './routes/index'
import Header from './components/header'

import {store} from './store'

export function App() {
  return(
  <Provider store={store}>
    <Header/>
    <Routers/>
  </Provider>
  )
}


