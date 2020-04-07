import { Algorithm } from '../../types'
import { boundAndRound, randomNormal } from './common'

const hinduShuffle: Algorithm = ({ malloc, memcpy, free, size }) => {
  // determine the size of the group to be pulled
  const group = boundAndRound(0, randomNormal(size / 5, size / 30), size - 1)

  // then determine the first index
  const start = boundAndRound(
    0,
    randomNormal((size - group) / 2, (size - group) / 6),
    size - group
  )

  const buffer = malloc(group)

  for (let i = 0; i < group; i++) memcpy(start + i, { buffer, index: i })
  for (let i = 0; i < start; i++) memcpy(start - i - 1, start + group - i - 1)
  for (let i = 0; i < group; i++) memcpy({ buffer, index: i }, i)

  free(buffer)
}

export default hinduShuffle
