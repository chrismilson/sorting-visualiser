import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { wrap } from 'redux-omt'
import App from './App'

const runAsync = async () => {
  const store = await wrap(new Worker(
    './state/store.worker.js',
    { type: 'module' }
  ))

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}
runAsync()
