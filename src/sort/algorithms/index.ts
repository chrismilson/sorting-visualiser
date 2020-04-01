import { Algorithm } from '../types'
import binaryInsertionSort from './binary-insertion-sort'
import bubbleSort from './bubble-sort'
import heapSort from './heap-sort'
import mergeSort from './merge-sort'
import quickSort from './quick-sort'
import shellSort from './shell-sort'
import timsort from './tim-sort'

import shuffle from './shuffle'

const algorithms: { [key: string]: Algorithm } = {
  binaryInsertionSort,
  bubbleSort,
  heapSort,
  mergeSort,
  quickSort,
  shellSort,
  timsort
}

export { shuffle }

export default algorithms
