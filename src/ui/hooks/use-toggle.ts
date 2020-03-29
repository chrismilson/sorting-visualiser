import { useState, useCallback } from 'react'

/** Toggles between two values */
function useToggle<T>(first: T, second: T): [T, () => void] {
  const [value, setValue] = useState(true)
  const toggle = useCallback(() => {
    setValue(value => !value)
  }, [])

  return [value ? first : second, toggle]
}

export default useToggle
