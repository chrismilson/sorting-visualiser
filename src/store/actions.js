/* Here we define some action types */
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

/* Other constants */

/* And some action creators */

/* These two actions will be governed by user interaction */
export function selectSubreddit (subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    payload: { subreddit }
  }
}

export function invalidateSubreddit (subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    payload: { subreddit }
  }
}

/* And these two actions will be dispatched by the network */
export function requestPosts (subreddit) {
  return {
    type: REQUEST_POSTS,
    payload: { subreddit }
  }
}

export function receivePosts (subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    payload: {
      subreddit,
      posts: json.data.children.map(child => child.data),
      receivedAt: Date.now()
    }
  }
}

// this is a thunk action creator; it returns a function, not an action object!
export function fetchPosts (subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch('https://www.reddit.com/r/${subreddit}.json')
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}
