import { Algorithm } from '../../types'
import cut from './cut'
import hinduShuffle from './hindu-shuffle'
import overhandShuffle from './overhand-shuffle'
import perfectRiffleShuffle from './perfect-riffle-shuffle'
import randomise from './randomise'
import reverse from './reverse'
import riffleShuffle from './riffle-shuffle'

const algorithms: { [key: string]: Algorithm } = {
  cut,
  hinduShuffle,
  overhandShuffle,
  perfectRiffleShuffle,
  randomise,
  reverse,
  riffleShuffle
}

export default algorithms
