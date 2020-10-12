import * as Comlink from 'comlink'
import { algorithms as sorts } from './algorithms/sort'
import { algorithms as unsorts } from './algorithms/unsort'
import { WorkerCalculateMethod } from './types'
import Tracker from './Tracker'

const calculate: WorkerCalculateMethod = (type, name, values) => {
  const algorithms = type === 'sort' ? sorts : unsorts
  if (!(name in algorithms)) {
    throw new Error(`sort (${name}) not implemented`)
  }

  console.log(`Worker: Performing ${type}: ${name}`)

  const tracker = new Tracker(values)
  algorithms[name](tracker)

  console.log(`Worker: Finished calculating ${type}: ${name}`)

  // We now have the calculated moves object, which we want to transfer to the
  // main thread. We also send back the final state of the values.
  const [buffer, numMoves] = tracker.getMoves()
  return [Comlink.transfer(buffer, [buffer]), numMoves, tracker.values]
}

Comlink.expose(calculate)
