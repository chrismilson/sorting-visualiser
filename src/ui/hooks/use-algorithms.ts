import { useState, useCallback, useEffect } from 'react'
import Untracker from '../../sort/Untracker'
import { Direction } from '../../sort/types'
import calculate from '../../sort'

function useAlgorithms(
  values: number[]
): {
  unsortWith: (
    name: string,
    block?: () => void,
    unblock?: () => void
  ) => Promise<void>
  sort: Untracker
  setSort: (name: string) => void
  sortString: string
} {
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

      return calculate('unsort', name, values, values).then(
        ([untracker, unsortedValues]) => {
          setUnsortedValues(unsortedValues)

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
  const [sortUntracker, setSortUntracker] = useState<Untracker>(
    new Untracker(new ArrayBuffer(0), 0, [])
  )

  useEffect(() => {
    let invalid = false

    calculate('sort', sortString, unsortedValues, values)
      .then(([untracker]) => !invalid && setSortUntracker(untracker))
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
