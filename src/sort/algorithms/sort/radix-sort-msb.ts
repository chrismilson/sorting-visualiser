import { Algorithm } from '../../types'

/**
 * The Radix Sort MSB can be performed in-place, while keeing track of the
 * different regions.
 */
const msbRadixSort: Algorithm = ({ nthBitSet, swap, size }) => {
  const loStack = [0]
  const hiStack = [size]
  const needleStack = [Math.floor(Math.log2(size))]

  while (loStack.length > 0) {
    // if the lostack has a value, the histack will also have a value.
    const lo = loStack.pop() as number
    const hi = hiStack.pop() as number
    const needle = needleStack.pop() as number

    let zero = lo
    let one = hi
    console.log()

    while (zero < one) {
      while (zero < one && !nthBitSet(zero, needle)) {
        zero += 1
      }
      while (zero < one && nthBitSet(one - 1, needle)) {
        one -= 1
      }
      if (zero < one) {
        swap(zero, one - 1)
      }
    }
    // the zero index is now the index of the first one
    if (lo + 1 < zero && needle > 0) {
      loStack.push(lo)
      hiStack.push(zero)
      needleStack.push(needle - 1)
    }
    if (zero + 1 < hi && needle > 0) {
      loStack.push(zero)
      hiStack.push(hi)
      needleStack.push(needle - 1)
    }
  }
}

export default msbRadixSort
