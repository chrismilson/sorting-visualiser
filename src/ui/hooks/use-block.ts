import { useState, useCallback, useMemo } from 'react'

const useBlock = () => {
  const [count, setCount] = useState(0)

  const blocking = count > 0
  const block = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  const unblock = useCallback(() => {
    setCount(count => Math.max(0, count - 1))
  }, [])

  return useMemo(() => ({ blocking, block, unblock }), [
    blocking,
    block,
    unblock
  ])
}

export default useBlock
