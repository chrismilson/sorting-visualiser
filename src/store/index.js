import reducer from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPostsIfNeeded } from './actions'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

store.dispatch(selectSubreddit('reactjs'))
store.dispatch(fetchPostsIfNeeded('reactjs'))
  .then(() => console.log(store.getState()))

export default store
