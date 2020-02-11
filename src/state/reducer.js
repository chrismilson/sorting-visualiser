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
 * This is the main reducer for our app's state.
 *
 * It is called when an action to update the state is run, and takes the current
 * state and the action to be run as inputs.
 *
 * It does not modify the state object, but returns what would be the next state
 * after the action is performed.
 *
 * @param {Object} state
 * @param {Object} action
 */
function todoApp (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case ADD_TODO:
      return {
        ...state,
        todos: todos(state.todos, action)
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: todos(state.todos, action)
      }
    case SET_VISIBILITY_FILTER:
      return {
        ...state,
        visibilityFilter: payload.filter
      }
    default:
      return state
  }
}
