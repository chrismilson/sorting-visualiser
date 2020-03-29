import { Move, MoveType } from './Move'
import Direction from './Direction'

/**
 * Just as the Tracker class is for recording the algorithms. The UnTracker is
 * for replaying a tracker.
 */
export default class Untracker {
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

    this.hasNext = this.hasNext.bind(this)
    this.hasPrevious = this.hasPrevious.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.reset = this.reset.bind(this)
  }

  /** Returns true if there is a future move available to do. */
  private hasNext() {
    return this.currentMove < this.moves.length
  }

  /** Returns true if there is a previous move available to undo. */
  private hasPrevious() {
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

  /** Advances the untracker in a direction determined by the reverse boolean */
  step(direction: Direction) {
    return direction === Direction.FORWARD ? this.next() : this.previous()
  }

  /**
   * Returns true if the untracker has a valid move available in the determined
   * direction
   */
  hasStep(direction: Direction) {
    return direction === Direction.FORWARD ? this.hasNext() : this.hasPrevious()
  }

  /**
   * Animates the advancement of steps in a given direction.
   *
   * @param stepsPerFrame The number of steps to be advanced per frame
   * @param onCompletion A callback to be run if all of the steps have been
   * completed.
   */
  animateStepsPerFrame(
    stepsPerFrame: number,
    direction: Direction,
    onCompletion?: () => void
  ) {
    let frame: number
    const run = () => {
      for (let i = 0; i < stepsPerFrame; i++) this.step(direction)
      if (this.hasStep(direction)) frame = requestAnimationFrame(run)
      else if (onCompletion) onCompletion()
    }
    run()
    return () => {
      cancelAnimationFrame(frame)
    }
  }

  animateUntilCompletion(
    timeUntilCompletion: number,
    direction: Direction,
    onCompletion?: () => void
  ) {
    const stepsRemaining =
      direction === Direction.FORWARD
        ? this.moves.length - this.currentMove
        : this.currentMove

    // there are 0.06 frames per millisecond
    const stepsPerFrame = stepsRemaining / (timeUntilCompletion * 0.06)

    if (stepsPerFrame > 1) {
      return this.animateStepsPerFrame(
        Math.round(stepsPerFrame),
        direction,
        onCompletion
      )
    } else if (stepsRemaining === 0) return

    const timePerStep = timeUntilCompletion / stepsRemaining
    const interval = setInterval(() => {
      this.step(direction)
      if (!this.hasStep(direction)) {
        clearInterval(interval)
        if (onCompletion) onCompletion()
      }
    }, timePerStep)
    return () => {
      clearInterval(interval)
    }
  }
}
