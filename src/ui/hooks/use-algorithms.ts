import { useState, useCallback, useEffect } from 'react'
import unsortingAlgorithms from '../../sort/algorithms/unsort'
import sortingAlgorithms from '../../sort/algorithms/sort'
import Tracker from '../../sort/Tracker'
import Untracker from '../../sort/Untracker'
import { Direction } from '../../sort/types'

const useAlgorithms = (values: number[]) => {
  /**
   * The original values will be displayed on the screen.
   *
   * This array is intended to be modified by the unsorting algorithm so that
   * the unsort can be untracked on the original values, and the sort can be
   * calculated while the unsort is running.
   */
  const [unsortedValues, setUnsortedValues] = useState([...values])
  useEffect(() => setUnsortedValues([...values]), [values])

  const unsortWith = useCallback(
    (name: string, block?: () => void, unblock?: () => void) => {
      if (name === 'nothing') {
        setUnsortedValues([...values])
        return
      }
      if (!(name in unsortingAlgorithms)) return

      if (block && unblock) block()

      const copy = [...values]
      const tracker = new Tracker(copy)

      unsortingAlgorithms[name](tracker)

      setUnsortedValues(copy)
      const untracker = tracker.untrack(values)

      untracker.animateUntilCompletion(500, Direction.FORWARD, {
        onCompletion: () => {
          if (unblock) unblock()
        }
      })
    },
    [values]
  )

  /** A string identifying the currently in use sort. */
  const [sortString, setSortString] = useState('heapSort')

  /** The untracker for the sort */
  const [sortUntracker, setSortUntracker] = useState<Untracker>()

  useEffect(() => {
    let invalid = false

    const calculate = async () => {
      if (!(sortString in sortingAlgorithms)) return
      const tracker = new Tracker(unsortedValues)

      // if calculation is made async we can put an await in front of this.
      sortingAlgorithms[sortString](tracker)

      const untracker = tracker.untrack(values)

      return untracker
    }

    calculate().then(untracker => !invalid && setSortUntracker(untracker))

    return () => {
      invalid = true
    }
  }, [sortString, unsortedValues, values])

  const setSort = useCallback((name: string) => {
    setSortString(name)
  }, [])

  return {
    unsortWith,
    sort: sortUntracker,
    setSort,
    sortString
  }
}

export default useAlgorithms
