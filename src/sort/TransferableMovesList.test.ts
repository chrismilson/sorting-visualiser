import { TransferableMovesBuilder, decodeMove } from './TransferableMovesList'
import { CompareMove, MoveType, SwapMove } from './types'

const exampleCompare: CompareMove = {
  type: MoveType.COMPARE,
  i: {
    buffer: 0,
    index: 1,
    value: 2
  },
  j: {
    buffer: 3,
    index: 4,
    value: 5
  },
  result: -1
}

const exampleSwap: SwapMove = {
  type: MoveType.SWAP,
  i: {
    buffer: 100,
    index: 101,
    value: 102
  },
  j: {
    buffer: 103,
    index: 104,
    value: 105
  }
}

describe('TransferableMovesBuilder.', () => {
  it('should encode a move', () => {
    const builder = new TransferableMovesBuilder()

    expect(builder.length).toEqual(0)
    builder.addMove(exampleCompare)
    expect(builder.length).toEqual(1)
  })

  it('should grow to acomodate more moves.', () => {
    const builder = new TransferableMovesBuilder()

    expect(builder.length).toEqual(0)
    for (let i = 0; i < 256; i++) {
      builder.addMove(exampleCompare)
    }
    expect(builder.length).toEqual(256)
    // The list will now be full and have to grow.
    builder.addMove(exampleSwap)

    expect(builder.length).toEqual(257)
  })

  it('should be decodable.', () => {
    const builder = new TransferableMovesBuilder()

    builder.addMove(exampleCompare)

    expect(decodeMove(builder.buffer, 0)).toMatchObject(exampleCompare)
  })

  it('should decode by index.', () => {
    const builder = new TransferableMovesBuilder()

    builder.addMove(exampleCompare)
    builder.addMove(exampleSwap)

    expect(decodeMove(builder.buffer, 1)).toMatchObject(exampleSwap)
  })

  it('should be decodable after growing.', () => {
    const builder = new TransferableMovesBuilder()

    for (let i = 0; i < 256; i++) {
      builder.addMove(exampleCompare)
    }

    // The buffer is now full, so adding another move will cause it to grow.
    builder.addMove(exampleSwap)

    expect(decodeMove(builder.buffer, 10)).toMatchObject(exampleCompare)
    expect(decodeMove(builder.buffer, 256)).toMatchObject(exampleSwap)
  })
})
