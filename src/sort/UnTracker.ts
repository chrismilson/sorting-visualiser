import { Move, MoveType } from './Move'

/**
 * Just as the Tracker class is for recording the algorithms. The UnTracker is
 * for replaying a tracker.
 */
export default class UnTracker {
  private original: number[]
  private values: number[]
  private moves: Move[]
  private currentMove: number

  constructor(moves: Move[], values: number[], original: number[]) {
    this.moves = moves
    this.values = values
    this.original = original

    // A tracker is not expected to undo any of the moves that were performed on
    // the data. The untracker has to take this into account, so by default will
    // be finished.
    this.currentMove = this.moves.length
  }

  /** Returns true if there is a future move available to do. */
  hasNext() {
    return this.currentMove < this.moves.length
  }

  /** Returns true if there is a previous move available to undo. */
  hasPrevious() {
    return this.currentMove > 0
  }

  next() {
    if (!this.hasNext()) return

    const move = this.moves[this.currentMove++]

    switch (move.type) {
      case MoveType.SWAP:
        const { i, j } = move
        const temp = this.values[i]
        this.values[i] = this.values[j]
        this.values[j] = temp
        break
      case MoveType.COMPARE:
        break
    }

    return move
  }

  previous() {
    if (!this.hasPrevious()) return

    const move = this.moves[--this.currentMove]

    switch (move.type) {
      case MoveType.SWAP:
        const { i, j } = move
        const temp = this.values[i]
        this.values[i] = this.values[j]
        this.values[j] = temp
        break
      case MoveType.COMPARE:
        break
    }

    return move
  }

  /** Returns the values array to its original state. */
  reset() {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] = this.original[i]
    }
    this.currentMove = 0
  }
}
