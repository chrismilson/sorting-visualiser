import { Algorithm } from '../../types'

/**
 * This algorithm does not sort an array - it shuffles an array. The original
 * values will be created sorted; this algorithm will then *un-sort* the values
 * before one of the actual algorithms can sort it.
 */
const shuffle: Algorithm = ({ swap, size }) => {
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    swap(i, j)
  }
}

export default shuffle
