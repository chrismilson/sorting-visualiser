import { Algorithm } from '../types'

const binaryInsertionSort: Algorithm = ({ compare, swap, size }) => {
  const findIndex = (target: number) => {
    let low = 0
    let high = target

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)
      if (compare(target, mid) < 0) high = mid
      else low = mid + 1
    }

    return low
  }

  for (let i = 1; i < size; i++) {
    const index = findIndex(i)
    for (let j = i; j > index; j--) {
      swap(j, j - 1)
    }
  }
}

export default binaryInsertionSort
