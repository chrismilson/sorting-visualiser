/**
 * In order to track the progress of a sorting algorithm, we do not give the
 * algorithms direct access to the array. Instead they will be given an instance
 * of the MoveTracker class, and will use the provided APIs to modify the array.
 *
 * The MoveTracker will keep track of the moves that have been made, and upon
 * completion will contain a full history of the sort that can be passed to the
 * rendering component.
 */
export default class MoveTracker {
  constructor (values) {
    this._values = values
    this._moves = []
  }

  get length () { return this._values.length }

  getMoves () { return this._moves }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - ***1*** if the value at i is less than at j
   * - ***0*** if the values are equal
   * - ***-1*** if the value at i is more than at j
   * @param {number} i
   * @param {number} j
   */
  compare (i, j) {
    this._moves.push({ type: 'compare', i, j })

    if (this._values[i] < this._values[j]) return -1
    if (this._values[i] > this._values[j]) return 1
    return 0 // equal
  }

  /**
   * Swaps the values at indicies i and j
   *
   * @param {number} i
   * @param {number} j
   */
  swap (i, j) {
    this._moves.push({ type: 'swap', i, j })

    const temp = this._values[i]
    this._values[i] = this._values[j]
    this._values[j] = temp
  }
}
