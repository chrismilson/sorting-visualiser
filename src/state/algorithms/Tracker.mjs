import { MoveTypes } from '../actions'
const { SWAP, COMPARE, START } = MoveTypes

export default class Tracker {
  constructor (values) {
    this._values = [...values]

    this._moves = [{
      type: START,
      payload: { values }
    }]
  }

  /**
   * Swaps the values at indicies i and j.
   *
   * @param {number} i
   * @param {number} j
   */
  swap (i, j) {
    // swap the values
    const temp = this._values[i]
    this._values[i] = this._values[j]
    this._values[j] = temp

    // then record the move
    this._moves.push({
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
  compare (i, j) {
    const result = Math.sign(this._values[i] - this._values[j])

    this._moves.push({
      type: COMPARE,
      payload: { i, j, result }
    })

    return result
  }

  /* Several helper methods to make compare code more readable. */
  lessThan (...args) {
    return this.compare(...args) < 0
  }

  lessThanEq (...args) {
    return this.compare(...args) <= 0
  }

  greaterThan (...args) {
    return this.compare(...args) > 0
  }

  greaterThanEq (...args) {
    return this.compare(...args) >= 0
  }
}
