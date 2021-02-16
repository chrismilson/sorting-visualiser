import { Move, MoveType } from './types'

/**
 * The number of bytes that represent each move.
 *
 * The most space needed for a move is on a compare move, which containse 7
 * different numbers. These numbers can each fit in 32 bits, and the type can
 * fit in 8 bits.
 */
export const BYTES_PER_MOVE = 26

/**
 * Provides the ability to take a `Move` object and encode it as a sequence of
 * numbers.
 *
 * @param move The move to be encoded.
 * @param buffer The ArrayBuffer representing all of the moves.
 * @param idx The index to insert into the list of moves at. (Not the number of
 * bytes)
 */
export const encodeMove = (
  move: Move,
  buffer: ArrayBuffer,
  idx: number
): void => {
  const offset = idx * BYTES_PER_MOVE
  const view = new DataView(buffer)
  // We encode the type into the first byte.
  view.setUint8(offset, move.type)

  // Depending on the type, the encoding will be different.
  switch (move.type) {
    case MoveType.COMPARE:
      // The only difference on a compare move is that we also encode the
      // result of the compare. Therefore we encode them with the same code.
      view.setUint32(offset + 1, move.i.buffer)
      view.setUint32(offset + 5, move.i.index)
      view.setUint32(offset + 9, move.i.value)
      view.setUint32(offset + 13, move.j.buffer)
      view.setUint32(offset + 17, move.j.index)
      view.setUint32(offset + 21, move.j.value)
      view.setInt8(offset + 25, move.result)
      break
    case MoveType.SWAP:
      // Swap moves contain two indexes, consisting of a buffer id and an
      // index in the buffer, plus the values at the indicies.
      view.setUint32(offset + 1, move.i.buffer)
      view.setUint32(offset + 5, move.i.index)
      view.setUint32(offset + 9, move.i.value)
      view.setUint32(offset + 13, move.j.buffer)
      view.setUint32(offset + 17, move.j.index)
      view.setUint32(offset + 21, move.j.value)
      break
    case MoveType.MALLOC:
      // A malloc move stores the size and id of the buffer that was
      // allocated.
      view.setUint32(offset + 1, move.buffer)
      view.setUint32(offset + 5, move.size)
      break
    case MoveType.MEMCPY:
      view.setUint32(offset + 1, move.from.buffer)
      view.setUint32(offset + 5, move.from.index)
      view.setUint32(offset + 9, move.to.buffer)
      view.setUint32(offset + 13, move.to.index)
      view.setUint32(offset + 17, move.value)
      view.setUint32(offset + 21, move.original)
      break
    case MoveType.FREE:
      view.setUint32(offset + 1, move.buffer)
      break
    case MoveType.NTH_BIT_SET:
      view.setUint32(offset + 1, move.index.buffer)
      view.setUint32(offset + 5, move.index.index)
      view.setUint8(offset + 9, move.result ? 1 : 0)
      break
  }
}

/**
 * Retrieves a move from an array buffer.
 *
 * @param buffer The buffer containing all of the moves.
 * @param idx The index of the move in the buffer.
 */
export const decodeMove = (buffer: ArrayBuffer, idx: number): Move => {
  const offset = idx * BYTES_PER_MOVE
  const view = new DataView(buffer)

  const type = view.getUint8(offset) as MoveType

  switch (type) {
    case MoveType.COMPARE:
      return {
        type: MoveType.COMPARE,
        i: {
          buffer: view.getUint32(offset + 1),
          index: view.getUint32(offset + 5),
          value: view.getUint32(offset + 9)
        },
        j: {
          buffer: view.getUint32(offset + 13),
          index: view.getUint32(offset + 17),
          value: view.getUint32(offset + 21)
        },
        result: view.getInt8(offset + 25)
      }
    case MoveType.SWAP:
      return {
        type: MoveType.SWAP,
        i: {
          buffer: view.getUint32(offset + 1),
          index: view.getUint32(offset + 5),
          value: view.getUint32(offset + 9)
        },
        j: {
          buffer: view.getUint32(offset + 13),
          index: view.getUint32(offset + 17),
          value: view.getUint32(offset + 21)
        }
      }
    case MoveType.MALLOC:
      return {
        type: MoveType.MALLOC,
        buffer: view.getUint32(offset + 1),
        size: view.getUint32(offset + 5)
      }
    case MoveType.MEMCPY:
      return {
        type: MoveType.MEMCPY,
        from: {
          buffer: view.getUint32(offset + 1),
          index: view.getUint32(offset + 5)
        },
        to: {
          buffer: view.getUint32(offset + 9),
          index: view.getUint32(offset + 13)
        },
        value: view.getUint32(offset + 17),
        original: view.getUint32(offset + 21)
      }
    case MoveType.FREE:
      return {
        type: MoveType.FREE,
        buffer: view.getUint32(offset + 1)
      }
    case MoveType.NTH_BIT_SET:
      return {
        type: MoveType.NTH_BIT_SET,
        index: {
          buffer: view.getUint32(offset + 1),
          index: view.getUint32(offset + 5)
        },
        result: view.getUint8(offset + 9) !== 0
      }
  }
}

/**
 * A wrapper for an `ArrayBuffer` that represents the different moves in a sort.
 *
 * An `ArrayBuffer` is preferable to a list of `Move` objects as it is
 * transferable between threads. An `ArrayBuffer` is however more difficult to
 * work with than a normal javascript `Array`, as it does not have any `push` or
 * `pop` methods.
 *
 * This class effectively implements a push method for an underlying array
 * buffer that can then be unwrapped when transfering between threads.
 */
export class TransferableMovesBuilder {
  /**
   * The buffer containing the encoded moves.
   */
  buffer: ArrayBuffer
  /**
   * The number of encoded moves in the buffer.
   */
  private size: number

  constructor() {
    this.size = 0
    this.buffer = new ArrayBuffer(256 * BYTES_PER_MOVE)
  }

  /**
   * Checks if there is enough space available in the current buffer for more
   * moves. If not doubles the allocated space and copies the previous values.
   *
   * The doubling allows the time complexity of adding a move to amortise to
   * O(1).
   */
  private growIfNeeded() {
    if ((this.size + 1) * BYTES_PER_MOVE <= this.buffer.byteLength) {
      return
    }
    // We need more space.

    // Allocate a new buffer.
    const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2)
    const oldView = new DataView(this.buffer)
    const newView = new DataView(newBuffer)

    // Copy the previous bytes.
    for (let i = 0; i < this.buffer.byteLength; i++) {
      newView.setUint8(i, oldView.getUint8(i))
    }

    // Replace the buffer.
    this.buffer = newBuffer
  }

  /**
   * Encodes a `Move` object and adds it to the buffer.
   *
   * @param move The move to be encoded.
   */
  addMove(move: Move): void {
    // We want to add the encoded move to the array buffer
    this.growIfNeeded()
    encodeMove(move, this.buffer, this.size)
    this.size += 1
  }

  get length(): number {
    return this.size
  }
}
