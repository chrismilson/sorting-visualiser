import Tracker from '../Tracker'
import quickSort from './quick-sort'
import bubbleSort from './bubble-sort'

const permute = (n: number) => {
  const numbers: number[] = []
  for (let i = 0; i < n; i++) numbers.push(i)

  const swap = (i: number, j: number) => {
    const temp = numbers[i]
    numbers[i] = numbers[j]
    numbers[j] = temp
  }

  const permutations: number[][][] = []

  const rec = (fixed: number) => {
    if (n - fixed < 2) {
      permutations.push([[...numbers]])
      return
    }
    for (let i = fixed; i < n; i++) {
      swap(fixed, i)
      rec(fixed + 1)
      swap(fixed, i)
    }
  }

  rec(0)
  return permutations
}

describe.each([
  ['quick', quickSort],
  ['bubble', bubbleSort]
])('%s sort', (_name, sort) => {
  it.each(permute(3))('should sort %p', values => {
    sort(new Tracker(values))

    expect(values).toBeSorted()
  })
})
