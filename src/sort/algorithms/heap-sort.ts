import { Algorithm } from '../types'

const heapSort: Algorithm = ({ compare, swap, size }) => {
  const heapify = (current: number, max: number) => {
    let extreme, left, right

    while (current < max) {
      extreme = current
      left = 2 * current + 1
      right = 2 * current + 2

      if (left < max && compare(extreme, left) < 0) extreme = left
      if (right < max && compare(extreme, right) < 0) extreme = right

      if (extreme === current) return
      swap(current, extreme)
      current = extreme
    }
  }

  for (let i = 0; i < size; i++) heapify(size - i - 1, size)

  for (let i = 0; i < size; i++) {
    swap(0, size - i - 1)
    heapify(0, size - i - 1)
  }
}

export default heapSort
