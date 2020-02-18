import { MoveTypes } from '../actions'
const { SWAP, COMPARE, START } = MoveTypes

/**
 * @param {Function} algorithm The sorting algorithm
 * @param {number[]} origValues The original values array
 * @returns {{ type: string, payload: * }[]} A sequence of actions to sort the
 * given values following the given sorting algorithm.
 */
export function calculate (algorithm, origValues) {
  const moves = [{
    type: START,
    payload: { values: origValues }
  }]
  const values = [...origValues]

  /**
   * Swaps the values at indicies i and j.
   *
   * @param {number} i
   * @param {number} j
   */
  const swap = (i, j) => {
    // swap the values
    const temp = values[i]
    values[i] = values[j]
    values[j] = temp

    // then record the move
    moves.push({
      type: SWAP,
      payload: { i, j }
    })
  }

  /**
   * Returns a 0, -1 or 1 depending on the values at indicies i and j. Behaves
   * in a similar manor to the compare function in Java.
   *
   * @param {number} i
   * @param {number} j
   */
  const compare = (i, j) => {
    const result = Math.sign(values[i] - values[j])

    moves.push({
      type: COMPARE,
      payload: { i, j, result }
    })

    return result
  }

  const lessThan = (...args) => compare(...args) < 0
  const lessThanEq = (...args) => compare(...args) <= 0
  const greaterThan = (...args) => compare(...args) > 0
  const greaterThanEq = (...args) => compare(...args) >= 0

  // pass the different apis to the sort
  algorithm({
    swap,
    compare,
    lessThan,
    lessThanEq,
    greaterThan,
    greaterThanEq
  })

  return moves
}
