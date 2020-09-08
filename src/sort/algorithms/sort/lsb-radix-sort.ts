import { Algorithm } from '../../types'

const lsbRadixSort: Algorithm = ({ nthBitSet, malloc, memcpy, free, size }) => {
  for (let needle = 0; 1 << needle <= size; needle++) {
    const zeroBuffer = malloc(size)
    let zeroIndex = 0
    const oneBuffer = malloc(size)
    let oneIndex = 0

    // partition the values based on their binary representations.
    for (let i = 0; i < size; i++) {
      if (nthBitSet(i, needle)) {
        memcpy(i, { buffer: oneBuffer, index: oneIndex++ })
      } else {
        memcpy(i, { buffer: zeroBuffer, index: zeroIndex++ })
      }
    }

    // put the values back in order.
    // first the zeros
    for (let i = 0; i < zeroIndex; i++) {
      memcpy({ buffer: zeroBuffer, index: i }, i)
    }
    free(zeroBuffer)
    // then the ones
    for (let i = 0; i < oneIndex; i++) {
      memcpy({ buffer: oneBuffer, index: i }, zeroIndex + i)
    }
    free(oneBuffer)
  }
}

export default lsbRadixSort
