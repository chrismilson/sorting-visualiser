import BubbleSort from './BubbleSort'
import * as MergeSort from './MergeSorts'
import * as QuickSort from './QuickSort'
import RadixSort from './RadixSort'

export default {
  BubbleSort: {
    algorithm: BubbleSort,
    name: 'Bubble sort'
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
  RadixSort: {
    algorithm: RadixSort,
    name: 'Radix sort'
  }
}
