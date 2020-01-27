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
   * Performs the next move on the data and returns a boolean that is true if
   * and only if a move was performed.
   */
  next () {
    if (this._moveIdx === this._moves.length) return false
    if (this._moveIdx === -1) {
      this._moveIdx++
      return true
    }

    const move = this._moves[this._moveIdx++]

    switch (move.type) {
      case 'swap':
        this._swap(move.i, move.j)
        break
      case 'compare': // we dont need to do anything with compare
      default:
    }

    return true
  }

  /**
   * Undoes the current move on the data and returns a boolean that is true if
   * and only if a move was undone.
   */
  prev () {
    if (this._moveIdx === -1) return false
    if (this._moveIdx === this._moves.length) {
      this._moveIdx--
      return true
    }

    const move = this._moves[--this._moveIdx]
    switch (move.type) {
      case 'swap':
        this._swap(move.i, move.j)
        break
      case 'compare': // we dont need to do anything with compare
      default:
    }

    return true
  }

  /**
   * When given a drawing context, will draw the current state of the sort with
   * these assumptions:
   *
   * - The horizontal range is from 0 to values.length, and;
   * - The vertical range is from 0 to 1.
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw (ctx) {
    // first clear the screen.
    ctx.clearRect(0, 0, this._values.length, 1)

    // then, draw the values.
    ctx.beginPath()
    ctx.moveTo(0, 0)
    this._values.forEach((v, i) => {
      ctx.lineTo(i, v)
      ctx.lineTo(i + 1, v)
    })
    ctx.lineTo(this._values.length, 0)
    ctx.closePath()

    ctx.fillStyle = 'rgb(87, 163, 207)'
    ctx.fill()

    // finally, draw the move if it exists
    if (this._moveIdx < 0 || this._moveIdx >= this._moves.length) return
    const move = this._moves[this._moveIdx]

    switch (move.type) {
      case 'swap':
        ctx.fillStyle('cyan')
        ctx.fillRect(move.i, 0, 1, this._values[move.i])
        ctx.fillRect(move.j, 0, 1, this._values[move.j])
        break
      case 'compare':
        const style = ['red', 'orange', 'green']
        ctx.fillStyle = style[1 - move.result]
        ctx.fillRect(move.i, 0, 1, this._values[move.i])
        ctx.fillStyle = style[1 + move.result]
        ctx.fillRect(move.j, 0, 1, this._values[move.j])
        break
      default: // draw nothing
    }
  }

  _swap (i, j) {
    const temp = this._values[i]
    this._values[i] = this._values[j]
    this._values[j] = temp
  }
}
