import {
  DO_NEXT_MOVE,
  MoveTypes,
  SET_ALGORITHM
} from './actions'
import { combineReducers } from 'redux'

function values (state = [], action) {
  const { type, payload } = action
  switch (type) {
    case SET_ALGORITHM:
      return []
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

function currentMove (state = 0, action) {
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
  values,
  algorithm,
  currentMove,
  moves
})

export default reducers
