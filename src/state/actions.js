export const SET_PLAY = 'SET_PLAY'

export const INCREASE_SIZE = 'INCREASE_SIZE'
export const DECREASE_SIZE = 'DECREASE_SIZE'
export const SET_SIZE = 'SET_SIZE'

export const SET_SPEED = 'SET_SPEED'

export const setPlay = status => ({ type: SET_PLAY, payload: status })

export const increaseSize = () => ({ type: INCREASE_SIZE })
export const decreaseSize = () => ({ type: DECREASE_SIZE })
export const setSize = size => ({ type: SET_SIZE, payload: size })

export const setSpeed = speed => ({ type: SET_SPEED, payload: speed })
