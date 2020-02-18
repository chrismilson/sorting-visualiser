import {
  MoveTypes,
  RECEIVE_MOVES,
  SET_ORIGINAL_VALUES
} from './actions'
import { combineReducers } from 'redux'

function originalValues (state = [], action) {
  const { type, payload } = action

  switch (type) {
    case SET_ORIGINAL_VALUES:
      return payload.values
    default:
      return state
  }
}

function currentValues (state = [], action) {
  const { type, payload } = action
  switch (type) {
    case MoveTypes.START:
      return payload.values
    case MoveTypes.SWAP:
      // copy current
      const next = [...state]
      // swap values
      next[payload.i] = state[payload.j]
      next[payload.j] = state[payload.i]
      return next
    default:
      return state
  }
}

function algorithm (state = '', action) {
  const { type, payload } = action

  switch (type) {
    case SET_ALGORITHM:
      return payload.algorithm
    default:
      return state
  }
}

function currentMove (state = -1, action) {
  const { type } = action

  switch (type) {
    case MoveTypes.START:
    case MoveTypes.SWAP:
    case MoveTypes.COMPARE:
      return state + 1
    default:
      return state
  }
}

function moves (state = [], action) {
  const { type, payload } = action

  switch (type) {
    default:
      return state
  }
}

const reducers = combineReducers({
  originalValues,
  currentValues,
  algorithm,
  currentMove,
  moves
})

export default reducers
