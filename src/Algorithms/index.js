import BubbleSort from './BubbleSort'
import SelectionSort from './SelectionSort'
import ShakerSort from './ShakerSort'
import * as MergeSort from './MergeSort'
import * as QuickSort from './QuickSort'
import * as RadixSort from './RadixSort'

export default {
  BubbleSort: {
    algorithm: BubbleSort,
    name: 'Bubble sort'
  },
  SelectionSort: {
    algorithm: SelectionSort,
    name: 'Selection sort'
  },
  ShakerSort: {
    algorithm: ShakerSort,
    name: 'Shaker sort'
  },
  MergeSortBF: {
    algorithm: MergeSort.BreadthFirst,
    name: 'Merge sort - Breadth first'
  },
  MergeSortDF: {
    algorithm: MergeSort.DepthFirst,
    name: 'Merge sort - Depth first'
  },
  QuickSortLeftmost: {
    algorithm: QuickSort.Leftmost,
    name: 'Quick sort - Leftmost pivot'
  },
  QuickSortRightmost: {
    algorithm: QuickSort.Rightmost,
    name: 'Quick sort - Rightmost pivot'
  },
  QuickSortRandom: {
    algorithm: QuickSort.Random,
    name: 'Quick sort - Random pivot'
  },
  QuickSortMiddle: {
    algorithm: QuickSort.Middle,
    name: 'Quick sort - Middle pivot'
  },
  QuickSortMedian: {
    algorithm: QuickSort.Median,
    name: 'Quick sort - Median pivot'
  },
  RadixSortBF: {
    algorithm: RadixSort.BreadthFirst,
    name: 'Radix sort - Breadth first'
  },
  RadixSortDF: {
    algorithm: RadixSort.DepthFirst,
    name: 'Radix sort - Depth first'
  }
}
