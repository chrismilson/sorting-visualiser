/* Here we define the action types */
export const DO_NEXT_MOVE = 'DO_NEXT_MOVE'
export const SET_ALGORITHM = 'SET_ALGORITHM'
export const RESET_TO_BEGINNING = 'RESET_TO_BEGINNING'

/* Other constants */
export const AlgorithmTypes = {
  BUBBLE_SORT: 'Bubble Sort',
  QUICK_SORT: 'Quick Sort'
}

/* Action creators */
export function doNextMove () {
  return { type: DO_NEXT_MOVE }
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
