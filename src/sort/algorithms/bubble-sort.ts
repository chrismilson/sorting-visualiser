import { Algorithm } from './Algorithm'

const bubbleSort: Algorithm = ({ swap, compare, size }) => {
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      if (compare(j, j - 1) < 0) swap(j, j - 1)
    }
  }
}

export default bubbleSort
