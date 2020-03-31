export enum MoveType {
  SWAP = 'SWAP',
  COMPARE = 'COMPARE',
  MALLOC = 'MALLOC',
  MEMCPY = 'MEMCPY',
  FREE = 'FREE'
}

export interface SwapMove {
  type: MoveType.SWAP
  i: { buffer: number; index: number; value: number }
  j: { buffer: number; index: number; value: number }
}

export interface CompareMove {
  type: MoveType.COMPARE
  i: { buffer: number; index: number; value: number }
  j: { buffer: number; index: number; value: number }
  result: number
}

export interface MallocMove {
  type: MoveType.MALLOC
  size: number
  buffer: number
}

export interface MemcpyMove {
  type: MoveType.MEMCPY
  from: { buffer: number; index: number }
  to: { buffer: number; index: number }
  value: number
  original: number
}

export interface FreeMove {
  type: MoveType.FREE
  buffer: number
}

export type Move = SwapMove | CompareMove | MallocMove | MemcpyMove | FreeMove
export default Move
