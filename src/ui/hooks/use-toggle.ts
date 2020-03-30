import { useState, useCallback } from 'react'

/** Toggles between two values */
function useToggle<T>(first: T, second: T): [T, (set?: T) => void] {
  const [value, setValue] = useState(true)
  const toggle = useCallback(
    (firstOrSecond?: T) => {
      if (firstOrSecond === first) setValue(true)
      else if (firstOrSecond === second) setValue(false)
      else setValue(value => !value)
    },
    [first, second]
  )

  return [value ? first : second, toggle]
}

export default useToggle
