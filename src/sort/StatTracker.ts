import { Move, MoveType } from './types'

export default class StatTracker {
  comparisons = 0
  reads = 0
  writes = 0

  private modifyBy(move: Move, multiplier: number) {
    switch (move.type) {
      case MoveType.COMPARE:
        this.reads += 2 * multiplier
        this.comparisons += 1 * multiplier
        break
      case MoveType.SWAP:
        this.reads += 2 * multiplier
        this.writes += 2 * multiplier
        break
      case MoveType.MALLOC:
        break
      case MoveType.MEMCPY:
        this.reads += 1 * multiplier
        this.writes += 1 * multiplier
        break
      case MoveType.FREE:
        break
      case MoveType.NTH_BIT_SET:
        this.reads += 1 * multiplier
        break
    }
  }

  add(move: Move): void {
    this.modifyBy(move, 1)
  }

  subtract(move: Move): void {
    this.modifyBy(move, -1)
  }
}
