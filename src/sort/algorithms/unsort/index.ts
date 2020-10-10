import { Algorithm } from '../../types'
import cut from './cut'
import hinduShuffle from './hindu-shuffle'
import overhandShuffle from './overhand-shuffle'
import perfectRiffleShuffle from './perfect-riffle-shuffle'
import randomise from './randomise'
import reverse from './reverse'
import riffleShuffle from './riffle-shuffle'

export const algorithms: { [key: string]: Algorithm } = {
  cut,
  hinduShuffle,
  overhandShuffle,
  perfectRiffleShuffle,
  randomise,
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
  'overhandShuffle',
  'perfectRiffleShuffle',
  'randomise',
  'reverse',
  'riffleShuffle'
]
