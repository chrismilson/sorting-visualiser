import Tracker from './Tracker'

/** The type that each sorting algorithm should implement */
export type Algorithm = (tracker: Tracker) => void

/** The different types of moves an algorithm can use */
export enum MoveType {
  SWAP = 'SWAP',
  COMPARE = 'COMPARE',
  MALLOC = 'MALLOC',
  MEMCPY = 'MEMCPY',
  FREE = 'FREE'
}

/**
 * Represents an index in an allocated buffer.
 */
export type Index = { buffer: number; index: number }

export interface SwapMove {
  type: MoveType.SWAP
  i: Index & { value: number }
  j: Index & { value: number }
}

export interface CompareMove {
  type: MoveType.COMPARE
  i: Index & { value: number }
  j: Index & { value: number }
  result: number
}

export interface MallocMove {
  type: MoveType.MALLOC
  size: number
  buffer: number
}

export interface MemcpyMove {
  type: MoveType.MEMCPY
  from: Index
  to: Index
  value: number
  original: number
}

export interface FreeMove {
  type: MoveType.FREE
  buffer: number
}

export type Move = SwapMove | CompareMove | MallocMove | MemcpyMove | FreeMove

/** Represents the direction of flow of an algorithm */
export enum Direction {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD'
}
