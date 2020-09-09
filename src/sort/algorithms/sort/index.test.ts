import Tracker from '../../Tracker'
import allSorts from '.'

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

/**
 * Returns an example array of randomised values
 */
const getExample = (n: number) => {
  // initialise the array with the intended values
  const result: number[] = []
  for (let i = 1; i <= n; i++) {
    result.push(i)
  }
  return result
}

/**
 * Returns a shuffled copy of the supplied array.
 */
const shuffled = <T>(arr: T[]) => {
  const result = [...arr]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    if (i !== j) {
      const temp = result[i]
      result[i] = result[j]
      result[j] = temp
    }
  }
  return result
}

/**
 * Example arrays with pairs of random shuffles and their sorted counterparts
 * for different lengths.
 */
const examples = [1, 2, 5, 23, 117, 2097]
  .map(getExample)
  .map(sorted => [shuffled(sorted), sorted])

describe.each(Object.entries(allSorts))('%s', (name, sort) => {
  it.each(examples)(`${name} should sort an example`, (unsorted, sorted) => {
    const copyUnsorted = [...unsorted]
    sort(new Tracker(copyUnsorted))

    expect(copyUnsorted).toMatchObject(sorted)
  })
})
