import worker from './worker'

/**
 * This is a wrapper for the web worker.
 *
 * In the main component, only some high level methods need to be called and
 * this module will communicate with the actual worker.
 *
 * The asynchronous code will be abstracted with promises.
 */
export default class AlgorithmWorker {
  constructor () {
    const blob = new window.Blob([`(${worker.toString()})()`])
    this.worker = new window.Worker(URL.createObjectURL(blob))
    this.worker.onmessage = this.handleMessage
    this.resolve = {}
    this.reject = {}
    this.id = 0
  }

  calculate (algorithm, values) {
    return new Promise((resolve, reject) => {
      const id = this.id++
      this.resolve[id] = resolve
      this.reject[id] = reject

      this.worker.postMessage({ id, algorithm, values })
    })
  }

  /**
   * When the worker responds, this method resolves the promise that was
   * supplied on request.
   *
   * @param {MessageEvent} message
   */
  handleMessage (message) {
    const { id, moves } = message.data
    this.resolve[id](moves)

    // clean up
    delete this.resolve[id]
    delete this.reject[id]
  }
}
