export enum MoveType {
  SWAP = 'SWAP',
  COMPARE = 'COMPARE',
  MALLOC = 'MALLOC',
  MEMCPY = 'MEMCPY',
  FREE = 'FREE'
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

export interface MallocMove {
  type: MoveType.MALLOC
  size: number
  buffer: number
}

export interface MemcpyMove {
  type: MoveType.MEMCPY
  size: number
  from: {
    buffer: number
    index: number
  }
  to: {
    buffer: number
    index: number
  }
}

export interface FreeMove {
  type: MoveType.FREE
  buffer: number
}

export type Move = SwapMove | CompareMove | MallocMove | MemcpyMove | FreeMove
export default Move
