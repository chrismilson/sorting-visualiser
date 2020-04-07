import { Algorithm } from '../../types'
import { boundAndRound, randomNormal } from './common'

const cut: Algorithm = ({ malloc, memcpy, free, size }) => {
  const split = boundAndRound(0, randomNormal(size / 2, size / 6), size)

  const buffer = malloc(split)

  for (let i = 0; i < split; i++) memcpy(i, { buffer, index: i })
  for (let i = 0; i < size - split; i++) memcpy(split + i, i)
  for (let i = 0; i < split; i++) memcpy({ buffer, index: i }, size - split + i)

  free(buffer)
}

export default cut
