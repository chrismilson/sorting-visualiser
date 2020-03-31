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

  inUse(id: BufferId) {
    return this._inUse.has(id)
  }

  /** Iterates over the keys in use. */
  [Symbol.iterator]() {
    return this._inUse[Symbol.iterator]()
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
  swap(
    i: { buffer: BufferId; index: number } | number,
    j: { buffer: BufferId; index: number } | number
  ): void {
    // normalise the inputs
    i = this.normaliseIndex(i)
    j = this.normaliseIndex(j)

    const iBuffer = this.buffers[i.buffer]
    const jBuffer = this.buffers[j.buffer]

    const temp = iBuffer[i.index]
    iBuffer[i.index] = jBuffer[j.index]
    jBuffer[j.index] = temp

    this.moves.push({ type: MoveType.SWAP, i, j })
  }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - **-1** If the value at i is less than the value at j;
   * - **0** If the value at i is equal to the value at j; or,
   * - **1** If the value at i is greater than the value at j.
   */
  compare(
    i: { buffer: BufferId; index: number } | number,
    j: { buffer: BufferId; index: number } | number
  ) {
    i = this.normaliseIndex(i)
    j = this.normaliseIndex(j)

    const iBuffer = this.buffers[i.buffer]
    const jBuffer = this.buffers[j.buffer]

    const result = Math.sign(iBuffer[i.index] - jBuffer[j.index])

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
    from: { buffer: BufferId; index: number } | number,
    to: { buffer: BufferId; index: number } | number
  ) {
    from = this.normaliseIndex(from)
    to = this.normaliseIndex(to)

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

  /**
   * Normalises an index so that it has a buffer property. Most of the functions
   * will work by just passing a number as the index, which should index the
   * main values array.
   */
  private normaliseIndex(index: { buffer: BufferId; index: number } | number) {
    if (typeof index === 'number') return { buffer: 0, index }
    return index
  }
}
