import { useMemo } from 'react'

/**
 * Supplies an array of length `size` with evenly spaced values in (0, 1].
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
