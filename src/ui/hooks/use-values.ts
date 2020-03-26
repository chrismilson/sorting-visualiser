import { useMemo } from 'react'

/** Returns a sorted array of `size` evenly spaced values in (0, 1] */
const getValues = (size: number) => {
  const values = []

  for (let i = 1; i <= size; i++) values.push(i / size)

  return values
}

const useValues = (size: number) => {
  const values = useMemo(() => getValues(size), [size])
  return values
}

export default useValues
