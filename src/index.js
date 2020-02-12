import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { wrap } from 'comlink'
import { remoteStoreWrapper } from 'redux-comlink'
import App from './App'

const run = async () => {
  const remoteStore = wrap(new Worker(
    './state/store.worker.js',
    { type: 'module' }
  ))
  const store = await remoteStoreWrapper(remoteStore)

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}
run()
