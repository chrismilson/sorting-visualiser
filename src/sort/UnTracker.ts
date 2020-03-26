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
  private isNext() {
    return this.currentMove < this.moves.length
  }

  /** Returns true if there is a previous move available to undo. */
  private isPrevious() {
    return this.currentMove > 0
  }

  next() {
    if (!this.isNext()) return false

    const move = this.moves[this.currentMove++]

    switch (move.type) {
      case MoveType.SWAP:
        const { i, j } = move
        const temp = this.values[i]
        this.values[i] = this.values[j]
        this.values[j] = temp
        return true
      case MoveType.COMPARE:
        return true
    }
  }

  previous() {
    if (!this.isPrevious()) return

    const move = this.moves[--this.currentMove]

    switch (move.type) {
      case MoveType.SWAP:
        const { i, j } = move
        const temp = this.values[i]
        this.values[i] = this.values[j]
        this.values[j] = temp
        return true
      case MoveType.COMPARE:
        return true
    }
  }
}
