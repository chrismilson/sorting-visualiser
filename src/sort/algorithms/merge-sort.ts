import { Algorithm } from '.'

const mergeSort: Algorithm = ({ compare, malloc, memcpy, free, size }) => {
  const merge = (low: number, mid: number, high: number) => {
    const buffer = malloc(high - low)

    let index = 0
    let i = low
    let j = mid
    while (i < mid && j < high) {
      if (compare(i, j) < 0) memcpy(i++, { buffer, index })
      else memcpy(j++, { buffer, index })
      index += 1
    }
    // copy remaining values to the end
    if (i < mid) {
      for (let k = i; k < mid; k++) {
        memcpy(k, high - mid + k)
      }
    }
    // copy back from memory
    while (index--) {
      memcpy({ buffer, index }, low + index)
    }

    free(buffer)
  }

  const split = (low: number, high: number) => {
    const mid = low + Math.floor((high - low) / 2)

    if (low < mid) {
      split(low, mid)
      split(mid, high)
      merge(low, mid, high)
    }
  }
  split(0, size)
}

export default mergeSort
