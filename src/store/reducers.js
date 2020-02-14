import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS
} from './actions'

function selectedSubreddit (state = 'reactjs', action) {
  const { type, payload } = action
  switch (type) {
    case SELECT_SUBREDDIT:
      return payload.subreddit
    default:
      return state
  }
}

function posts (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  const { type, payload } = action
  switch (type) {
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: payload.posts,
        lastUpdated: payload.receivedAt
      }
    default:
      return state
  }
}

function postsBySubreddit (state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case INVALIDATE_SUBREDDIT:
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
      return {
        ...state,
        [payload.subreddit]: posts(state[payload.subreddit], action)
      }
    default:
      return state
  }
}

const redditApp = combineReducers({
  selectedSubreddit,
  postsBySubreddit
})

export default redditApp
