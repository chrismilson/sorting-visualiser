import { createStore } from 'redux'
import { expose } from 'comlink'
import todoApp from './reducers'

const store = createStore(todoApp)

expose(store)
