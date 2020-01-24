/**
 * Just as the tracker class is used as an API to record the moves of a sorting
 * algorithm, the untracker is intended to be use as an API to play back moves
 * after they have been calculated.
 *
 * This way, the methods are easily matched against their counterparts in
 * tracker, and the mutation of the values array can be abstracted behind the
 * class.
 */
export default class Untracker {
  constructor (values, moves) {
    // we may have got the values from a component's props or something that we
    // don't necessarily want to mutate. Therefore we will take a copy.
    const valuesCopy = [...values]
    this._values = valuesCopy

    this._buffers = {
      main: valuesCopy
    }
    this._nextBufferId = 0

    // we will not mutate moves, so we don't need to copy it
    this._moves = moves
    /**
     * The index of the last move performed.
     * -1 is the state before any sorting, and moves.length is the state after
     * sorting.
     */
    this._moveIdx = -1
  }

  /**
   * Gives a copy of the currnt values.
   */
  get values () {
    return [...this._values]
  }

  /**
   * Performs the next move on the data and returns a double:
   *
   * - The move performed, and a pointer to the values array.
   */
  next () {
    const move = this._moves[this._moveIdx++]

    switch (move.type) {
      case 'swap':
        this._swap(move.i, move.j)
        break
      case 'compare': // we dont need to do anything with compare
      default:
    }

    return move
  }

  _swap (i, j) {
    const temp = this._values[i]
    this._values[i] = this._values[j]
    this._values[j] = temp
  }
}
