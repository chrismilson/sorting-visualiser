import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux'
import todoApp from './state/reducers'
import App from './App'

const store = createStore(todoApp)

ReactDom.render(<App />, document.getElementById('root'))
