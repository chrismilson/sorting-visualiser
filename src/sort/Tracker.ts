import { Move, MoveType } from './Move'

/**
 * Abstracts the values array to the sorting algorithm so that the moves can be
 * monitored and recorded.
 */
export default class Tracker {
  private values: number[]
  private moves: Move[]
  readonly size: number

  constructor(values: number[]) {
    this.values = values
    this.size = values.length
    this.moves = []

    this.swap = this.swap.bind(this)
    this.compare = this.compare.bind(this)
  }

  getMoves() {
    return this.moves
  }

  /**
   * Swaps the values at indicies i and j.
   */
  swap(i: number, j: number) {
    const temp = this.values[i]
    this.values[i] = this.values[j]
    this.values[j] = temp

    this.moves.push({ type: MoveType.SWAP, i, j })
  }

  /**
   * Compares the values at indicies i and j and returns:
   *
   * - **-1** If the value at i is less than the value at j;
   * - **0** If the value at i is equal to the value at j; or,
   * - **1** If the value at i is greater than the value at j.
   */
  compare(i: number, j: number) {
    const result = Math.sign(this.values[i] - this.values[j])

    this.moves.push({ type: MoveType.COMPARE, i, j, result })

    return result
  }
}
