import Tracker from '../../Tracker'
import { algorithms as allSorts } from '.'

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
  .map((sorted) => [shuffled(sorted), sorted])

describe.each(Object.entries(allSorts))('%s', (name, sort) => {
  it.each(examples)(`${name} should sort an array`, (unsorted, sorted) => {
    const copyUnsorted = [...unsorted]
    sort(new Tracker(copyUnsorted))

    expect(copyUnsorted).toMatchObject(sorted)
  })
})
