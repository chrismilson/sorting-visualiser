import Tracker from './Tracker'

describe('move tracker', () => {
  describe('swap', () => {
    it('should swap elements', () => {
      const values = [0, 1]
      const tracker = new Tracker(values)

      tracker.swap(0, 1)

      expect(values).toStrictEqual([1, 0])
    })
  })

  describe('compare', () => {
    it.each([
      ['that are smaller', 0, 1, -1],
      ['that are equal', 0, 0, 0],
      ['that are bigger', 1, 0, 1]
    ])('should compare elements %s', (_string, a, b, result) => {
      const values = [a, b]
      const tracker = new Tracker(values)

      expect(tracker.compare(0, 1)).toBe(result)
    })
  })
})
