import { Algorithm } from '.'

const bubbleSort: Algorithm = ({ swap, compare, size }) => {
  for (let i = 0; i < size - 1; i++) {
    for (let j = size - 1; j > i; j--) {
      if (compare(j, j - 1) < 0) swap(j, j - 1)
    }
  }
}

export default bubbleSort
