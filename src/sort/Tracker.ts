import { MoveType, Move, Index } from './types'
import Untracker from './Untracker'

class BufferIdPool {
  private _next = 1
  private _inUse: Set<number> = new Set([])

  next(): number {
    const id = this._next++
    this._inUse.add(id)
    return id
  }

  free(id: number) {
    this._inUse.delete(id)
  }

  inUse(id: number) {
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
  /** A list of the current buffers in use for the sort. */
  private buffers: {
    /** The main values array */
    0: number[]
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
    this.buffers = {
      0: values
    }
    this.bufferIdPool = new BufferIdPool()
    this.size = values.length
    this.moves = []

    this.swap = this.swap.bind(this)
    this.compare = this.compare.bind(this)
    this.malloc = this.malloc.bind(this)
    this.memcpy = this.memcpy.bind(this)
    this.free = this.free.bind(this)
    this.nthBitSet = this.nthBitSet.bind(this)
  }

  /**
   * Returns an untracker with the moves tracked by the tracker.
   *
   * @param values The array to modify while untracking
   */
  untrack(values = this.buffers[0]) {
    return new Untracker(this.moves, values, this.original)
  }

  /**
   * Swaps the values at indicies i and j.
   */
  swap(iIndex: Index | number, jIndex: Index | number): void {
    // normalise the inputs
    const i = this.normaliseIndex(iIndex)
    const j = this.normaliseIndex(jIndex)

    const iBuffer = this.buffers[i.buffer]
    const jBuffer = this.buffers[j.buffer]

    iBuffer[i.index] = j.value
    jBuffer[j.index] = i.value

    this.moves.push({ type: MoveType.SWAP, i, j })
  }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - **-1** If the value at i is less than the value at j;
   * - **0** If the value at i is equal to the value at j; or,
   * - **1** If the value at i is greater than the value at j.
   */
  compare(iIndex: Index | number, jIndex: Index | number) {
    const i = this.normaliseIndex(iIndex)
    const j = this.normaliseIndex(jIndex)

    const result = Math.sign(i.value - j.value)

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

    return buffer
  }

  /**
   * Copies a value from one buffer to another.
   */
  memcpy(from: Index | number, to: Index | number) {
    from = this.normaliseIndex(from)
    to = this.normaliseIndex(to)

    // copy
    const value = this.buffers[from.buffer][from.index]

    // remember
    const original = this.buffers[to.buffer][to.index]

    // paste
    this.buffers[to.buffer][to.index] = value

    this.moves.push({ type: MoveType.MEMCPY, from, to, value, original })
  }

  /**
   * Releases a chunk of memory.
   *
   * @param buffer The id of the buffer to free.
   */
  free(buffer: number) {
    // we cant free the main values
    if (buffer > 0) {
      delete this.buffers[buffer]
      this.bufferIdPool.free(buffer)
      this.moves.push({ type: MoveType.FREE, buffer })
    }
  }

  /**
   * Returns a boolean that is true if and only if the nth (little endian) bit
   * of the value at a given index is set.
   *
   * @param givenIndex The index of the value to check.
   * @param n The bit (little endian) of the value to check.
   */
  nthBitSet(givenIndex: Index | number, n: number) {
    const index = this.normaliseIndex(givenIndex)

    const result = Boolean(index.value & (1 << n))

    this.moves.push({ type: MoveType.NTH_BIT_SET, index, result })

    return result
  }

  /**
   * Normalises an index so that it has a buffer property. Most of the functions
   * will work by just passing a number as the index, which should index the
   * main values array.
   */
  private normaliseIndex(index: Index | number): Index & { value: number } {
    if (typeof index === 'number') index = { buffer: 0, index }
    const value = this.buffers[index.buffer][index.index]
    return { ...index, value }
  }
}
