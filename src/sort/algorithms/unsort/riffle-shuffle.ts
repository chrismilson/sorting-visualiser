import { Algorithm } from '../../types'
import { boundAndRound, randomNormal } from './common'

const riffle: Algorithm = ({ malloc, memcpy, free, size }) => {
  const split = boundAndRound(0, randomNormal(size / 2, size / 10), size)
  const buffer = malloc(split)

  for (let i = 0; i < split; i++) memcpy(i, { buffer, index: i })

  let pA = 0
  let pB = split
  let dest = 0

  while (pA < split && pB < size) {
    if (Math.random() > 0.5) {
      memcpy({ buffer, index: pA++ }, dest++)
    } else {
      memcpy(pB++, dest++)
    }
  }
  // the rest of B is already at the end.
  while (pA < split) memcpy({ buffer, index: pA++ }, dest++)

  free(buffer)
}

export default riffle
