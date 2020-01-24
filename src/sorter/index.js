import Worker from './sorter.worker'
import algorithms from './sorts'

/**
 * Simple Id reuse class.
 */
function IdPool () {
  this._free = []
  this._next = 0
}

/**
 * Returns a currently unused Id.
 */
IdPool.prototype.next = function () {
  if (this._free.length) return this._free.pop()
  return this._next++
}

/**
 * Marks an Id ready for reuse.
 */
IdPool.prototype.free = function (id) {
  this._free.push(id)
}

/**
 * The Sorter object abstracts the worker interface to the end user.
 * The end user will interact with the sorter through promises, and the sorter
 * will pass jobs to the worker as called.
 */
function Sorter () {
  /**
   * The names of the different algorithms
   */
  this.algorithms = Object.keys(algorithms)
  this.resolve = {}
  this.reject = {}
  this.ids = new IdPool()

  this.worker = new Worker()
  this.worker.onmessage = message => {
    const { id, status, moves, error } = message.data

    switch (status) {
      case 200:
        this.resolve[id](moves)
        break
      default:
        this.reject[id](error || new Error(`Unspecified Error`))
    }

    delete this.resolve[id]
    delete this.reject[id]
    this.ids.free(id)
  }
}

/**
 * An async method for calculating the moves of the sort. Stores the response
 * methods to the promise with an id that can be used when the worker sends a
 * message on completion.
 */
Sorter.prototype.calculate = function (algorithm, values) {
  return new Promise((resolve, reject) => {
    const id = this.ids.next()
    this.resolve[id] = resolve
    this.reject[id] = reject

    this.worker.postMessage({ id, algorithm, values })
  })
}

export default new Sorter()
