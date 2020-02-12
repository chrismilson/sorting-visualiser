import { combineReducers } from 'redux'
import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

/**
 * A helper reducer for the todos array.
 *
 * @param {*[]} state The current todos array
 * @param {Object} action The action being performed
 */
function todos (state = [], action) {
  const { type, payload } = action
  switch (type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: payload.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, idx) => {
        return idx === payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      })
    default:
      return state
  }
}

/**
 * A helper reducer for the visibility filter.
 *
 * @param {string} state
 * @param {Object} action
 */
function visibilityFilter (state = VisibilityFilters.SHOW_ALL, action) {
  const { type, payload } = action
  switch (type) {
    case SET_VISIBILITY_FILTER:
      return payload.filter
    default:
      return state
  }
}

/**
 * This is the main reducer for our app's state.
 *
 * It is called when an action to update the state is run, and takes the current
 * state and the action to be run as inputs.
 *
 * It does not modify the state object, but returns what would be the next state
 * after the action is performed.
 *
 * It takes advantage of redux's combineReducers to combine the individual todos
 * and visibility filter reducers into a single main reducer.
 *
 * @param {Object} state
 * @param {Object} action
 */
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

export default todoApp
