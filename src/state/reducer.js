import { combineReducers } from 'redux'
import {
  SET_PLAY,
  SET_SIZE,
  INCREASE_SIZE,
  DECREASE_SIZE,
  SET_SPEED
} from './actions'

const play = (state = false, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_PLAY:
      return payload
    default:
      return state
  }
}

const size = (state = 12, action) => {
  const { type, payload } = action

  switch (type) {
    case INCREASE_SIZE:
      return state + 1
    case DECREASE_SIZE:
      return state - 1
    case SET_SIZE:
      return payload
    default:
      return state
  }
}

const speed = (state = -2, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_SPEED:
      return payload
    default:
      return state
  }
}

export default combineReducers({ play, size, speed })
