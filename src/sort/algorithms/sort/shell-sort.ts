import { Algorithm } from '../../types'

const shellSort: Algorithm = ({ compare, swap, size }) => {
  let gap = ~~(size / 2)

  while (gap > 0) {
    for (let i = gap; i < size; i++) {
      for (let j = i; j >= gap && compare(j - gap, j) > 0; j -= gap) {
        swap(j - gap, j)
      }
    }
    gap = ~~(gap / 2)
  }
}

export default shellSort
