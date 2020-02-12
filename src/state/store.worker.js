import { createStore } from 'redux'
import { expose } from 'redux-omt'
import todoApp from './reducers'

const store = createStore(todoApp)

expose(store)
