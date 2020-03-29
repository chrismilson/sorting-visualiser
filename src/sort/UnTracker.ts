import { Move, MoveType } from './Move'

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

  /** Wraps an untracker and provides some apis for interacting with it. */
  wrap(reverse: boolean) {
    const step = (direction = reverse) => {
      return direction ? this.previous() : this.next()
    }
    const hasStep = (direction = reverse) => {
      return direction ? this.hasPrevious() : this.hasNext()
    }

    const animateStepsPerFrame = (steps: number, onCompletion: () => void) => {
      let frame: number
      const run = () => {
        for (let i = 0; i < steps; i++) step()
        if (hasStep()) frame = requestAnimationFrame(run)
        else onCompletion()
      }
      frame = requestAnimationFrame(run)
      return () => {
        cancelAnimationFrame(frame)
      }
    }

    /**
     * Completes all of the this's remaining moves.
     *
     * @param timeUntilCompletion The number of milliseconds until the animation
     * should be complete.
     */
    const animateUntilCompletion = (
      timeUntilCompletion: number,
      onCompletion: () => void
    ) => {
      const stepsRemaining = reverse
        ? this.currentMove
        : this.moves.length - this.currentMove

      const stepsPerFrame = stepsRemaining / (timeUntilCompletion * 0.06)

      if (stepsPerFrame > 1) {
        return animateStepsPerFrame(Math.floor(stepsPerFrame), onCompletion)
      }
      const timePerStep = timeUntilCompletion / stepsRemaining
      const interval = setInterval(() => {
        step()
        if (!hasStep()) {
          onCompletion()
          clearInterval(interval)
        }
      }, timePerStep)
      return () => {
        clearInterval(interval)
      }
    }

    return {
      step,
      hasStep,
      animateStepsPerFrame,
      animateUntilCompletion
    }
  }
}
