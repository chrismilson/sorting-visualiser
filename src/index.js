import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './state/reducers'
import App from './App'

const store = createStore(todoApp)

ReactDom.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
