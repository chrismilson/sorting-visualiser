import { Algorithm } from '../../sort/algorithms'
import { useMemo } from 'react'
import Tracker from '../../sort/Tracker'

/**
 * Performs an algorithm on the values via a tracker and returns the tracker
 * after the moves have been performed.
 */
const useAlgorithm = (algorithm: Algorithm, values: number[]) => {
  return useMemo(() => {
    const tracker = new Tracker(values)
    algorithm(tracker)
    return tracker
  }, [algorithm, values])
}

export default useAlgorithm
