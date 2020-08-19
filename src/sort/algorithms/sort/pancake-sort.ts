import { Algorithm } from '../../types'

/**
 * Pancake sort is an interesting problem:
 *
 * Given a stack of pancakes of different sizes, only by flipping the top k
 * pancakes, sort the pancakes with the largest at the bottom and smallest on
 * the top.
 */
const pancakeSort: Algorithm = ({ compare, swap, size }) => {
  const flip = (index: number) => {
    let lo = 0
    let hi = index
    while (lo < hi) {
      swap(lo++, hi--)
    }
  }

  const sortMax = (n: number) => {
    // find the largest pancake in the unsorted section
    let maxIdx = 0
    for (let i = 1; i <= n; i++) {
      if (compare(maxIdx, i) < 0) {
        maxIdx = i
      }
    }

    if (maxIdx === n) {
      return
    }

    // make sure the next largest pancake is on the top
    if (maxIdx > 0) {
      flip(maxIdx)
    }
    flip(n)
  }

  for (let i = size - 1; i > 0; i--) {
    sortMax(i)
  }
}

export default pancakeSort
