/* Here we define the action types */
export const SET_ALGORITHM = 'SET_ALGORITHM'
export const RESET_TO_BEGINNING = 'RESET_TO_BEGINNING'

/* Other constants */
export const AlgorithmTypes = {
  BUBBLE_SORT: 'BUBBLE_SORT',
  QUICK_SORT: 'QUICK_SORT'
}

export const MoveTypes = {
  START: 'MOVE_START',
  SWAP: 'MOVE_SWAP',
  COMPARE: 'MOVE_COMPARE'
}

/* Action creators */
export function doNextMove () {
  return (dispatch, getState) => {
    const { moves, currentMove } = getState()

    dispatch(moves[currentMove])
  }
}

export function setAlgorithm (algorithm) {
  return {
    type: SET_ALGORITHM,
    payload: { algorithm }
  }
}

export function resetToBeginning () {
  return { type: RESET_TO_BEGINNING }
}
