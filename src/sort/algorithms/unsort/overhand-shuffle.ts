import { Algorithm } from '../../types'
import { boundAndRound, randomNormal } from './common'

/**
 * This shuffle is supposed to represent the normal shuffle that people do with
 * playing cards, and attempts to show the drawbacks of not shuffling properly.
 *
 * You will notice that runs often stay together, and the general order of the
 * entire array tends to reverse after each round
 */
const overhand: Algorithm = ({ malloc, memcpy, free, size }) => {
  let processed = 0

  while (processed < size) {
    const group = Math.min(
      size - processed,
      boundAndRound(0, randomNormal(size / 7, size / 20), size)
    )

    const buffer = malloc(group)
    // Copy the group into memory from the back
    for (let i = 0; i < group; i++) {
      memcpy(size - group + i, { buffer, index: i })
    }
    // Shift the remaining values
    for (let i = 0; i < size - processed - group; i++) {
      memcpy(size - group - i - 1, size - i - 1)
    }
    // Put the group at the front
    for (let i = 0; i < group; i++) {
      memcpy({ buffer, index: i }, processed + i)
    }

    free(buffer)
    processed += group
  }
}

export default overhand
