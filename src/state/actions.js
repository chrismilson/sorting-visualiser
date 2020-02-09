/* Here we define some action types */

export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/* Other constants */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/* And some action creators */

export function addTodo (text) {
  return {
    type: ADD_TODO,
    payload: { text }
  }
}

export function toggleTodo (id) {
  return {
    type: TOGGLE_TODO,
    payload: { id }
  }
}

export function setVisibilityFilter (filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    payload: { filter }
  }
}
