/* global self */

import algorithms from './sorts'
import Tracker from './tracker'

self.onmessage = message => {
  const { id, algorithm, values } = message.data

  const tracker = new Tracker(values)
  if (algorithm in algorithms) {
    try {
      algorithms[algorithm](tracker) // modifies tracker

      self.postMessage({
        id,
        values,
        moves: tracker.getMoves(),
        status: 200
      })
    } catch (e) {
      self.postMessage({
        id,
        status: 400,
        error: e
      })
    }
  } else {
    self.postMessage({
      id,
      status: 404,
      error: new Error(`Specified algorithm (${algorithm}) does not exist.`)
    })
  }
}
