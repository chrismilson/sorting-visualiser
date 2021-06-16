import { Algorithm } from '../../types'
import cut from './cut'
import hinduShuffle from './hindu-shuffle'
import knuthShuffle from './knuth-shuffle'
import overhandShuffle from './overhand-shuffle'
import perfectRiffleShuffle from './perfect-riffle-shuffle'
import reverse from './reverse'
import riffleShuffle from './riffle-shuffle'

export const algorithms: { [key: string]: Algorithm } = {
  cut,
  hinduShuffle,
  knuthShuffle,
  overhandShuffle,
  perfectRiffleShuffle,
  reverse,
  riffleShuffle
}

/**
 * Strings representing the currently implemented unsorting algorithms.
 */
// see `../sort/index.ts`.
export const algorithmNames = [
  'cut',
  'hinduShuffle',
  'knuthShuffle',
  'overhandShuffle',
  'perfectRiffleShuffle',
  'reverse',
  'riffleShuffle'
]
