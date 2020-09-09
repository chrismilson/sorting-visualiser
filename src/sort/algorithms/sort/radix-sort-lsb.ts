import { Algorithm } from '../../types'

const lsbRadixSort: Algorithm = ({ nthBitSet, malloc, memcpy, free, size }) => {
  for (let needle = 0; 1 << needle <= size; needle++) {
    const buffer = malloc(size)
    let zeroIndex = 0
    let oneIndex = size - 1

    // partition the values based on their binary representations.
    for (let i = 0; i < size; i++) {
      if (nthBitSet(i, needle)) {
        memcpy(i, { buffer, index: oneIndex-- })
      } else {
        memcpy(i, { buffer, index: zeroIndex++ })
      }
    }

    // put the values back in order.
    // first the zeros
    for (let i = 0; i < zeroIndex; i++) {
      memcpy({ buffer, index: i }, i)
    }
    // then the ones
    for (let i = 0; i < size - oneIndex - 1; i++) {
      memcpy({ buffer, index: size - i - 1 }, zeroIndex + i)
    }
    free(buffer)
  }
}

export default lsbRadixSort
