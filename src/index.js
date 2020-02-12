import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { wrap, proxy } from 'comlink'
import App from './App'

const runAsync = async () => {
  const remoteStore = wrap(new Worker(
    './state/store.worker.js',
    { type: 'module' }
  ))
  const store = await remoteStoreWrapper(remoteStore)

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}
runAsync()

async function remoteStoreWrapper (store) {
  const subscribers = new Set()
  let latestState = await store.getState()

  store.subscribe(proxy(async () => {
    latestState = await store.getState()
    subscribers.forEach(f => f())
  }))
  return {
    getState: () => latestState,
    dispatch: action => { store.dispatch(action) },
    subscribe: listener => {
      subscribers.add(listener)
      return () => subscribers.delete(listener)
    }
  }
}
