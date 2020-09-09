import { Algorithm } from '../../types'
import binaryInsertionSort from './binary-insertion-sort'
import bubbleSort from './bubble-sort'
import heapSort from './heap-sort'
import mergeSort from './merge-sort'
// import pancakeSort from './pancake-sort'
import quickSort from './quick-sort'
import radixSortLsb from './radix-sort-lsb'
import radixSortMsb from './radix-sort-msb'
import shellSort from './shell-sort'
import timsort from './tim-sort'

const algorithms: { [key: string]: Algorithm } = {
  binaryInsertionSort,
  bubbleSort,
  heapSort,
  mergeSort,
  // pancakeSort,
  quickSort,
  radixSortLsb,
  radixSortMsb,
  shellSort,
  timsort
}

export default algorithms
