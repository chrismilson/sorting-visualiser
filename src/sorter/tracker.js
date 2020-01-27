/**
 * In order to track the progress of a sorting algorithm, we do not give the
 * algorithms direct access to the array. Instead they will be given an instance
 * of the MoveTracker class, and will use the provided APIs to modify the array.
 *
 * The MoveTracker will keep track of the moves that have been made, and upon
 * completion will contain a full history of the sort that can be passed to the
 * rendering component.
 */
export default class Tracker {
  constructor (values) {
    this.size = values.length

    this._values = values

    /**
     * if an algorithm requires extra memory, any buffers will be kept here.
     *
     * An alias for the main values array will be kept here to make cleaner code
     * in some of the move methods.
     *
     * e.g. If someone wants to compare a value in extra memory with a value in
     * the main values buffer, we would have to have a messy check in the
     * compare function to choose between a member of the buffers object or just
     * use the values array.
     */
    this._buffers = { values }
    this._nextBufferId = 0
    this._moves = []

    // these functions will be used inside the sorting algorithms, so we want to
    // make sure they are bound correctly.
    this.compare = this.compare.bind(this)
    this.swap = this.swap.bind(this)
    this.malloc = this.malloc.bind(this)
    this.free = this.free.bind(this)
    this.memcpy = this.memcpy.bind(this)
  }

  getMoves () { return this._moves }

  _checkLength () {
    if (this._moves.length > 1000000) throw new Error(`Too many moves`)
  }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - ***1*** if the value at i is less than at j
   * - ***0*** if the values are equal
   * - ***-1*** if the value at i is more than at j
   * @param {number} i
   * @param {number} j
   */
  compare (i, j, iBufferId = 'values', jBufferId = 'values') {
    let result

    if (this._buffers[iBufferId][i] < this._buffers[jBufferId][j]) {
      result = -1
    } else if (this._buffers[iBufferId][i] > this._buffers[jBufferId][j]) {
      result = 1
    } else {
      result = 0
    }

    this._moves.push({ type: 'compare', i, j, result })

    this._checkLength()

    return result
  }

  /**
   * Swaps the values at indicies i and j.
   *
   * @param {number} i
   * @param {number} j
   */
  swap (i, j) {
    this._moves.push({ type: 'swap', i, j })

    const temp = this._values[i]
    this._values[i] = this._values[j]
    this._values[j] = temp

    this._checkLength()
  }

  /**
   * Allocates a new array of extra memory and stores it in the buffers object.
   * Initialises the values to zero.
   *
   * Returns an id from which the array can be accessed.
   * Allocating memory takes a single move.
   *
   * @param {number} size The size of the extra memory required
   */
  malloc (size) {
    const id = this._nextBufferId++

    this._buffers[id] = new Array(size).fill(0)
    this._moves.push({ type: 'malloc', size, id })

    return id
  }

  /**
   * When given a buffer id, frees up the memory when it is no longer needed.
   *
   * @param {*} id The id of the buffer no longer needed.
   */
  free (id) {
    if (id === 'values') {
      throw new Error(`Cannot free the main values array.`)
    }
    // Warn about freeing unallocated memory, since there there may be a
    // problem. Perhaps a different buffer was supposed to be freed, and that
    // may lead to a memory leak.
    if (!(id in this._buffers)) {
      console.warn(
        `Tried to free memory that was no longer needed at id ${id}.`
      )
    }

    delete this._buffers[id]
    this._moves.push({ type: 'free', id })
  }

  /**
   * Copies 'size' values from index i in the ith buffer and pastes
   * them into the jth buffer starting at the jth index.
   *
   * @param {number} i The starting index to copy from in buffer I
   * @param {number} j The starting index to copy from in buffer J
   * @param {*} iBufferId
   * @param {*} jBufferId
   * @param {number} size the number of values to copy.
   */
  memcpy (i, j, iBufferId, jBufferId, size = 1) {
    const I = this._buffers[iBufferId]
    const J = this._buffers[jBufferId]
    if (!I || !J) {
      throw new Error(`Bad buffer: ${iBufferId}, ${jBufferId}.`)
    }
    if (i < 0 || i + size > I.length || j < 0 || j + size > J.length) {
      throw new Error(`Accessing memory outside of allocation.`)
    }

    for (var k = 0; k < size; k++) {
      J[j + k] = I[i + k]
    }

    this._moves.push({ type: 'memCopy', i, j, iBufferId, jBufferId, size })
    this._checkLength()
  }
}
