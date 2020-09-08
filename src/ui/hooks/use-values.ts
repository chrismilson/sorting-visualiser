import { useMemo } from 'react'

/**
 * Supplies a sorted array containing the integers from 1 to size.
 *
 * The array reference will change when the size changes.
 */
const useValues = (size: number) => {
  return useMemo(() => {
    const values = []

    for (let i = 1; i <= size; i++) values.push(i)

    return values
  }, [size])
}

export default useValues
