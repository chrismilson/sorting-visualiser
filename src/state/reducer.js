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
 * This is the main reducer for our app's state.
 *
 * It is called when an action to update the state is run, and takes the current
 * state and the action to be run as inputs.
 * @param {Object} state
 * @param {Object} action
 */
function todoApp (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: payload.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, idx) => {
          if (idx === payload.id) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: payload.filter
      })
    default:
      return state
  }
}
