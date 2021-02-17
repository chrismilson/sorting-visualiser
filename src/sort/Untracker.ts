import { MoveType, Move, Direction } from './types'
import StatTracker from './StatTracker'
import { decodeMove } from './TransferableMovesList'

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
  private moves: ArrayBuffer
  private numMoves: number
  private currentMove: number
  statistics: StatTracker

  constructor(moves: ArrayBuffer, numMoves: number, values: number[]) {
    this.moves = moves
    this.numMoves = numMoves
    this.buffers = {
      0: values
    }
    this.bufferIds = new Set()
    this.original = [...values]

    this.currentMove = 0

    this.statistics = new StatTracker()

    this.hasNext = this.hasNext.bind(this)
    this.hasPrevious = this.hasPrevious.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.reset = this.reset.bind(this)
  }

  /** Returns true if there is a future move available to do. */
  private hasNext(): boolean {
    return this.currentMove < this.numMoves
  }

  /** Returns true if there is a previous move available to undo. */
  private hasPrevious(): boolean {
    return this.currentMove > 0
  }

  next(): Move | undefined {
    if (!this.hasNext()) return

    const move = decodeMove(this.moves, this.currentMove++)

    this.statistics.add(move)

    switch (move.type) {
      case MoveType.SWAP:
        {
          const { i, j } = move
          this.buffers[i.buffer][i.index] = j.value
          this.buffers[j.buffer][j.index] = i.value
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

  previous(): Move | undefined {
    if (!this.hasPrevious()) return

    const move = decodeMove(this.moves, --this.currentMove)

    this.statistics.subtract(move)

    switch (move.type) {
      case MoveType.SWAP:
        {
          const { i, j } = move
          this.buffers[i.buffer][i.index] = i.value
          this.buffers[j.buffer][j.index] = j.value
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
  reset(): void {
    // delete the extra buffers
    this.bufferIds.forEach((id) => {
      delete this.buffers[id]
    })

    for (let i = 0; i < this.original.length; i++) {
      this.buffers[0][i] = this.original[i]
    }

    this.currentMove = 0
  }

  /** Advances the untracker in a direction determined by the reverse boolean */
  step(direction: Direction): Move | undefined {
    return direction === Direction.FORWARD ? this.next() : this.previous()
  }

  /**
   * Returns true if the untracker has a valid move available in the determined
   * direction
   */
  hasStep(direction: Direction): boolean {
    return direction === Direction.FORWARD ? this.hasNext() : this.hasPrevious()
  }

  /**
   * Animates the sort in the specified direction until cancellation or
   * completion. Attempts to animate a certain number of frames per millisecond.
   *
   * @param stepsPerMS The number of steps to complete per millisecond on average.
   * @param direction The direction to animate in.
   * @param options Optional parameters
   * @param options.onCompletion A callback to fire once the sort has completed
   * animating.
   * @param options.moveRef A react ref object that will be updated to hold the
   * last performed move on the data.
   * @returns a callback to cancel the animation.
   */
  animateStepsPerMS(
    stepsPerMS: number,
    direction: Direction,
    options: {
      onCompletion?: () => void
      moveRef?: React.MutableRefObject<Move | undefined>
    } = {}
  ): () => void {
    const start: DOMHighResTimeStamp = performance.now()
    let completeSteps = 0
    let frameId: number

    const doSteps = (numSteps: number): Move | undefined => {
      let result: Move | undefined
      for (let i = 0; i < numSteps; i++) {
        result = this.step(direction)
      }
      return result
    }

    const frame = (time: DOMHighResTimeStamp) => {
      // how many miliseconds have elapsed since the start
      const elapsed = time - start
      // how many steps should we do on this frame?
      const steps = Math.round(elapsed * stepsPerMS - completeSteps)

      if (steps === 0) {
        // no steps, so just ask for another frame and continue.
        frameId = requestAnimationFrame(frame)
        return
      }

      const lastMove = doSteps(steps)
      completeSteps += steps

      if (options.moveRef) {
        options.moveRef.current = lastMove
      }

      if (this.hasStep(direction)) {
        // we should ask for more frames if we have more moves to do.
        frameId = requestAnimationFrame(frame)
      } else if (options.onCompletion) {
        // fire the callback if it was defined
        options.onCompletion()
      }
    }

    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }

  animateUntilCompletion(
    timeUntilCompletion: number,
    direction: Direction,
    options: {
      onCompletion?: () => void
      moveRef?: React.MutableRefObject<Move | undefined>
    } = {}
  ): () => void {
    const stepsRemaining =
      direction === Direction.FORWARD
        ? this.numMoves - this.currentMove
        : this.currentMove

    const stepsPerMS = stepsRemaining / timeUntilCompletion

    return this.animateStepsPerMS(stepsPerMS, direction, options)
  }

  forEachInExtra(
    callback: (buffer: number, index: number, value: number) => void
  ): void {
    this.bufferIds.forEach((buffer) => {
      this.buffers[buffer].forEach((value, index) =>
        callback(buffer, index, value)
      )
    })
  }
}
