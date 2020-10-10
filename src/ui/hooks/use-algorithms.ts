import { useState, useCallback, useEffect } from 'react'
import Untracker from '../../sort/Untracker'
import { Direction } from '../../sort/types'
import calculate from '../../sort'

const useAlgorithms = (values: number[]) => {
  /**
   * The state of the unsorted values before they have been sorted.
   *
   * By keeping track of these values, we can calculate the sort on the unsorted
   * values before the unsort has finished animating.
   */
  const [unsortedValues, setUnsortedValues] = useState([...values])
  useEffect(() => setUnsortedValues([...values]), [values])

  const unsortWith = useCallback(
    async (name: string, block?: () => void, unblock?: () => void) => {
      if (name === 'nothing') {
        setUnsortedValues([...values])
        return
      }
      if (block && unblock) block()

      return calculate('unsort', name, values).then(
        ([moves, unsortedValues]) => {
          setUnsortedValues(unsortedValues)
          const untracker = new Untracker(moves, values)

          untracker.animateUntilCompletion(500, Direction.FORWARD, {
            onCompletion: () => {
              if (unblock) unblock()
            }
          })
        }
      )
    },
    [values]
  )

  /** A string identifying the currently in use sort. */
  const [sortString, setSortString] = useState('heapSort')

  /** The untracker for the sort */
  const [sortUntracker, setSortUntracker] = useState<Untracker>()

  useEffect(() => {
    let invalid = false

    calculate('sort', sortString, unsortedValues)
      .then(([moves]) => {
        return new Untracker(moves, values)
      })
      .then(untracker => !invalid && setSortUntracker(untracker))
      .catch(console.error)

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
