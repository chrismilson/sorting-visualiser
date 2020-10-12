import Tracker from './Tracker'
import Untracker from './Untracker'

/** The type that each sorting algorithm should implement */
export type Algorithm = (tracker: Tracker) => void

/** The different types of moves an algorithm can use */
export enum MoveType {
  SWAP = 1,
  COMPARE = 2,
  MALLOC = 3,
  MEMCPY = 4,
  FREE = 5,
  NTH_BIT_SET = 6
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

export interface NthBitSetMove {
  type: MoveType.NTH_BIT_SET
  index: Index
  result: boolean
}

export type Move =
  | SwapMove
  | CompareMove
  | MallocMove
  | MemcpyMove
  | FreeMove
  | NthBitSetMove

/** Represents the direction of flow of an algorithm */
export enum Direction {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD'
}

/**
 * The signature for the worker's calculate method.
 *
 * The return value will consist of the array buffer representing the moves, the
 * number of encoded moves in the array buffer, and the final state of the
 * values array.
 */
export type WorkerCalculateMethod = (
  type: 'sort' | 'unsort',
  name: string,
  values: number[]
) => [ArrayBuffer, number, number[]]

/**
 * The signature for the main thread's calculate method, wrapping the worker.
 */
export type MainThreadCalculateMethod = (
  type: 'sort' | 'unsort',
  name: string,
  valuesToSort: number[],
  valuesToTrack: number[]
) => Promise<[Untracker, number[]]>
