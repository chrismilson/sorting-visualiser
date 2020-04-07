import { Algorithm } from '../../types'

/**
 * Does what it says on the tin.
 */
const reverse: Algorithm = ({ swap, size }) => {
  for (let i = 0; i < Math.floor(size / 2); i++) {
    swap(i, size - i - 1)
  }
}

export default reverse
