export enum MoveType {
  SWAP = 'SWAP',
  COMPARE = 'COMPARE'
}

export interface SwapMove {
  type: MoveType.SWAP
  i: number
  j: number
}

export interface CompareMove {
  type: MoveType.COMPARE
  i: number
  j: number
  result: number
}

export type Move = SwapMove | CompareMove
