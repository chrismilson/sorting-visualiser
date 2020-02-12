import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { wrap } from 'comlink'
import App from './App'

const remoteStore = wrap(new window.Worker('./state/store.worker.js'))
const store = remoteStore

ReactDom.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
