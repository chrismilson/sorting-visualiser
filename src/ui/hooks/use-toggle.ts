import { useState, useCallback } from 'react'

/** Toggles between two values */
function useToggle<A, B>(first: A, second: B): [A | B, (set?: A | B) => void] {
  const [value, setValue] = useState(true)
  const toggle = useCallback(
    (firstOrSecond?: A | B) => {
      if (firstOrSecond === first) setValue(true)
      else if (firstOrSecond === second) setValue(false)
      else setValue((value) => !value)
    },
    [first, second]
  )

  return [value ? first : second, toggle]
}

export default useToggle
