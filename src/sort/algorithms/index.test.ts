import Tracker from '../Tracker'
import quickSort from './quick-sort'
import bubbleSort from './bubble-sort'

describe.each([
  ['quick', quickSort],
  ['bubble', bubbleSort]
])('%s sort', (_name, sort) => {
  it.each([
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    [1, 5, 6, 2, 2, 22, 3, 66, 7, 899, 3, 4, 1, 2333, 6, 5, 444, 3, 2, 55],
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  ])('should sort data', (...values) => {
    const tracker = new Tracker(values)
    sort(tracker)
    expect(values).toBeSorted()
  })
})
