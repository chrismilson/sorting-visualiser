import { useMemo, useState, useEffect } from 'react'
import { Algorithm } from '../../sort/types'
import Tracker from '../../sort/Tracker'
import Untracker from '../../sort/Untracker'

/**
 * Performs an algorithm on the values via a tracker and returns the tracker
 * after the moves have been performed.
 */
const useAlgorithm = (
  algorithm: Algorithm,
  originalValues: number[],
  resetAfter = false
) => {
  return useMemo(() => {
    const values = [...originalValues]
    const tracker = new Tracker(values)
    algorithm(tracker)

    const untracker = tracker.untrack()
    if (resetAfter) untracker.reset()

    return { untracker, values }
  }, [algorithm, originalValues, resetAfter])
}

export const useAlgorithmAsync = (algorithm: Algorithm, values: number[]) => {
  const [untracker, setUntracker] = useState<Untracker>()

  useEffect(() => {
    // async effect returns promise, hence IIFE
    ;(async () => {
      // calculate on a copy
      const tracker = new Tracker([...values])
      algorithm(tracker)

      // then replay on the real values
      const untracker = tracker.untrack(values)
      untracker.reset()

      setUntracker(untracker)
    })()
  }, [algorithm, values])

  return untracker
}

export default useAlgorithm
