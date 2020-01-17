import Worker from './simulator.worker'

/**
 * This is a wrapper for a web worker that will perform the calculation.
 *
 * In the main component, only some high level methods need to be called and
 * this module will communicate with the actual worker.
 *
 * The asynchronous worker interaction will be abstracted with promises.
 */
export default class Simulator {
  constructor () {
    this.worker = new Worker()
    this.worker.onmessage = this.handleMessage.bind(this)
    this.resolve = {}
    this.reject = {}
    this.id = 0

    this.calculate = this.calculate.bind(this)
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
  }
}
