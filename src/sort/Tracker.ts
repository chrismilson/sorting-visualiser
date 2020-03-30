import Move, { MoveType } from './Move'
import Untracker from './Untracker'

type BufferId = number
class BufferIdPool {
  private _next = 1
  private _inUse: Set<BufferId> = new Set([])
  private _free: BufferId[] = []

  next(): BufferId {
    const id = this._free.pop() || this._next++
    this._inUse.add(id)
    return id
  }

  free(id: BufferId) {
    this._inUse.delete(id)
    this._free.push(id)
  }
}

/**
 * Abstracts the values array to the sorting algorithm so that the moves can be
 * monitored and recorded.
 */
export default class Tracker {
  /** A copy of the original values that the Tracker was instantiated with. */
  private original: number[]
  /** The current values whose modification is being tracked. */
  private values: number[]
  /** A list of the current buffers in use for the sort. */
  private buffers: {
    [key: number]: number[]
  }
  /** An object that will give and keep track of unique keys. */
  private bufferIdPool: BufferIdPool
  /** The moves that have been done to the values. */
  private moves: Move[]
  /** The length of the values array. */
  readonly size: number

  constructor(values: number[]) {
    this.original = [...values]
    this.values = values
    this.buffers = {
      0: values
    }
    this.bufferIdPool = new BufferIdPool()
    this.size = values.length
    this.moves = []

    this.swap = this.swap.bind(this)
    this.compare = this.compare.bind(this)
  }

  /**
   * Returns an untracker with the moves tracked by the tracker.
   *
   * @param values The array to modify while untracking
   */
  untrack(values = this.values) {
    return new Untracker(this.moves, values, this.original)
  }

  /**
   * Swaps the values at indicies i and j.
   */
  swap(i: number, j: number) {
    const temp = this.values[i]
    this.values[i] = this.values[j]
    this.values[j] = temp

    this.moves.push({ type: MoveType.SWAP, i, j })
  }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - **-1** If the value at i is less than the value at j;
   * - **0** If the value at i is equal to the value at j; or,
   * - **1** If the value at i is greater than the value at j.
   */
  compare(i: number, j: number) {
    const result = Math.sign(this.values[i] - this.values[j])

    this.moves.push({ type: MoveType.COMPARE, i, j, result })

    return result
  }

  /**
   * Comparable to the C malloc function, however instead of returning a pointer
   * to the allocated buffer, will return an id to the buffer that was
   * allocated.
   */
  malloc(size: number) {
    const buffer = this.bufferIdPool.next()

    this.buffers[buffer] = new Array(size)

    this.moves.push({ type: MoveType.MALLOC, size, buffer })
  }

  /**
   * Copies a chunk of memory from one buffer to another.
   *
   * @param size The number of elements to copy.
   * @param from.buffer The id of the buffer to copy from. (defaults to the main
   * array)
   * @param from.index The first index in the from buffer to copy from.
   * @param to.buffer The id of the buffer to copy to. (defaults to the main
   * array)
   * @param to.index The first index in the to buffer to copy from.
   */
  memcpy(
    size: number,
    fromOptions: {
      buffer?: BufferId
      index: number
    },
    toOptions: {
      buffer?: BufferId
      index: number
    }
  ) {
    // buffer 0 is the main values array
    const from = Object.assign({}, { buffer: 0 }, fromOptions)
    const to = Object.assign({}, { buffer: 0 }, toOptions)

    for (let i = 0; i < size; i++) {
      // copy
      const value = this.buffers[from.buffer][i + from.index]

      // paste
      this.buffers[to.buffer][i + to.index] = value
    }

    this.moves.push({ type: MoveType.MEMCPY, size, from, to })
  }

  /**
   * Releases a chunk of memory.
   *
   * @param buffer The id of the buffer to free.
   */
  free(buffer: BufferId) {
    // we cant free the main values
    if (buffer > 0) {
      delete this.buffers[buffer]
      this.bufferIdPool.free(buffer)
      this.moves.push({ type: MoveType.FREE, buffer })
    }
  }
}
