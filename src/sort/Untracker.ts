import Move, { MoveType } from './Move'
import Direction from './Direction'

/**
 * Just as the Tracker class is for recording the algorithms. The UnTracker is
 * for replaying a tracker.
 */
export default class Untracker {
  private original: number[]
  private buffers: {
    [key: number]: number[]
  }
  private bufferIds: Set<number>
  private moves: Move[]
  private currentMove: number

  constructor(moves: Move[], values: number[], original: number[]) {
    this.moves = moves
    this.buffers = {
      0: values
    }
    this.bufferIds = new Set()
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
        {
          const { i, j } = move
          const iBuffer = this.buffers[i.buffer]
          const jBuffer = this.buffers[j.buffer]

          const temp = iBuffer[i.index]
          iBuffer[i.index] = jBuffer[j.index]
          jBuffer[j.index] = temp
        }
        break
      case MoveType.MALLOC:
        {
          const { buffer } = move
          this.bufferIds.add(buffer)
          this.buffers[buffer] = []
        }
        break
      case MoveType.MEMCPY:
        {
          const { from, to } = move

          const value = this.buffers[from.buffer][from.index]
          this.buffers[to.buffer][to.index] = value
        }
        break
      case MoveType.FREE:
        {
          const { buffer } = move
          this.bufferIds.delete(buffer)
        }
        break
    }

    return move
  }

  previous() {
    if (!this.hasPrevious()) return

    const move = this.moves[--this.currentMove]

    switch (move.type) {
      case MoveType.SWAP:
        {
          const { i, j } = move
          const iBuffer = this.buffers[i.buffer]
          const jBuffer = this.buffers[j.buffer]

          const temp = iBuffer[i.index]
          iBuffer[i.index] = jBuffer[j.index]
          jBuffer[j.index] = temp
        }
        break
      case MoveType.MALLOC:
        {
          const { buffer } = move
          this.bufferIds.delete(buffer)
        }
        break
      case MoveType.MEMCPY:
        {
          const {
            to: { buffer, index },
            original
          } = move

          this.buffers[buffer][index] = original
        }
        break
      case MoveType.FREE:
        {
          const { buffer } = move
          this.bufferIds.add(buffer)
        }
        break
    }

    return move
  }

  /** Returns the values array to its original state. */
  reset() {
    // delete the extra buffers
    this.bufferIds.forEach(id => {
      delete this.buffers[id]
    })

    for (let i = 0; i < this.original.length; i++) {
      this.buffers[0][i] = this.original[i]
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
    options: {
      onCompletion?: () => void
      moveRef?: React.MutableRefObject<Move | undefined>
    } = {}
  ) {
    const { onCompletion, moveRef } = options

    const base = (stepsPerFrame: number) => {
      for (let i = 0; i < stepsPerFrame; i++) this.step(direction)
    }

    // if the moveRef is defined then record the last move
    const withRecord = moveRef
      ? () => {
          base(stepsPerFrame - 1)
          moveRef.current = this.step(direction)
        }
      : () => base(stepsPerFrame)

    const withAnimationFrame = () => {
      let frame: number
      const run = () => {
        withRecord()
        if (this.hasStep(direction)) frame = requestAnimationFrame(run)
        else if (onCompletion) onCompletion()
      }
      run()
      return () => {
        cancelAnimationFrame(frame)
      }
    }
    const withInterval = () => {
      const interval = setInterval(() => {
        withRecord()
        if (!this.hasStep(direction)) {
          clearInterval(interval)
          if (onCompletion) onCompletion()
        }
      }, 1 / (0.06 * stepsPerFrame))
      return () => {
        clearInterval(interval)
      }
    }

    return stepsPerFrame >= 1 ? withAnimationFrame() : withInterval()
  }

  animateUntilCompletion(
    timeUntilCompletion: number,
    direction: Direction,
    options: {
      onCompletion?: () => void
      moveRef?: React.MutableRefObject<Move | undefined>
    } = {}
  ) {
    const stepsRemaining =
      direction === Direction.FORWARD
        ? this.moves.length - this.currentMove
        : this.currentMove

    // there are 0.06 frames per millisecond
    const stepsPerFrame = stepsRemaining / (timeUntilCompletion * 0.06)

    return this.animateStepsPerFrame(stepsPerFrame, direction, options)
  }

  forEachInExtra(
    callback: (buffer: number, index: number, value: number) => void
  ) {
    this.bufferIds.forEach(buffer => {
      this.buffers[buffer].forEach((value, index) =>
        callback(buffer, index, value)
      )
    })
  }
}
