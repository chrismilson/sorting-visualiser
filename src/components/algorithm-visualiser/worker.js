/* global self */
/* eslint-disable no-restricted-globals */

import BubbleSort from './algorithms/bubble-sort'
import MoveTracker from './move-tracker'

export default () => {
  self.onmessage = m => {
    const { id, algorithm, values } = m.data

    const tracker = new MoveTracker(values)
    BubbleSort(tracker) // modifies tracker

    self.postMessage({ id, moves: tracker.getMoves() })
  }
}
