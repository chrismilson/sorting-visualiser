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

export const algorithms: { [key: string]: Algorithm } = {
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

/**
 * Strings representing the names of the implemented algorithms.
 */
// I would like to implement the names with something like this:
//
// `export const algorithmNames = Object.keys(algorithms)`
//
// However, Tree shaking would then include the algotithms object to retrieve
// the keys. This will bloat the main package and is sub optimal, so I have
// resorted to just writing them here.
export const algorithmNames = [
  'binaryInsertionSort',
  'bubbleSort',
  'heapSort',
  'mergeSort',
  // 'pancakeSort',
  'quickSort',
  'radixSortLsb',
  'radixSortMsb',
  'shellSort',
  'timsort'
]
