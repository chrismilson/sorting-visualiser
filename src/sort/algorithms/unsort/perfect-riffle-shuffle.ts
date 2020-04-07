import { Algorithm } from '../../types'

const perfectRiffle: Algorithm = ({ malloc, memcpy, free, size }) => {
  const halfSize = size >> 1
  const buffer = malloc(halfSize)
  for (let i = 0; i < halfSize; i++) memcpy(i, { buffer, index: i })

  let firstHalf = 0
  let secondHalf = halfSize
  let destination = 0
  while (firstHalf < halfSize && secondHalf < size) {
    memcpy({ buffer, index: firstHalf++ }, destination++)
    memcpy(secondHalf++, destination++)
  }
  free(buffer)
}

export default perfectRiffle
