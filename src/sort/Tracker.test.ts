import Tracker from './Tracker'
import { SwapMove, MoveType, CompareMove } from './Move'

describe('move tracker', () => {
  describe('swap', () => {
    it('should swap elements', () => {
      const values = [0, 1]
      const tracker = new Tracker(values)

      tracker.swap(0, 1)

      expect(values).toStrictEqual([1, 0])
    })

    it('should log a valid move', () => {
      const tracker = new Tracker([0, 1])

      tracker.swap(0, 1)
      const moves = tracker.getMoves()

      expect(moves.length).toBe(1)
      expect(moves[0]).toMatchObject<SwapMove>({
        type: MoveType.SWAP,
        i: 0,
        j: 1
      })
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

    it('should log a valid move', () => {
      const tracker = new Tracker([0, 1])

      const result = tracker.compare(0, 1)
      const moves = tracker.getMoves()

      expect(moves.length).toBe(1)
      expect(moves[0]).toMatchObject<CompareMove>({
        type: MoveType.COMPARE,
        i: 0,
        j: 1,
        result
      })
    })
  })
})
