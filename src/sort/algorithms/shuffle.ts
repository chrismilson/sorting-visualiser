import { Algorithm } from '.'

/**
 * This algorithm does not sort an array - it shuffles an array. The original
 * values will be created sorted; this algorithm will then *un-sort* the values
 * before one of the actual algorithms can sort it.
 */
const shuffle: Algorithm = ({ swap, size }) => {
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(Math.random() * (size - i))
    swap(i, j)
  }
}

export default shuffle
