import BubbleSort from './BubbleSort'
import SelectionSort from './SelectionSort'
import ShakerSort from './ShakerSort'
import InsertionSort from './InsersionSort'
import HeapSort from './HeapSort'
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
  InsertionSort: {
    algorithm: InsertionSort,
    name: 'Insertion sort'
  },
  ShakerSort: {
    algorithm: ShakerSort,
    name: 'Shaker sort'
  },
  HeapSort: {
    algorithm: HeapSort,
    name: 'Heap sort'
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
  RadixSortMSDBF: {
    algorithm: RadixSort.MSDBreadthFirst,
    name: 'Radix sort - MSD - Breadth first'
  },
  RadixSortMSDDF: {
    algorithm: RadixSort.MSDDepthFirst,
    name: 'Radix sort - MSD - Depth first'
  },
  RadixSortLSD: {
    algorithm: RadixSort.LSDBreadthFirst,
    name: 'Radix sort - LSD'
  }
}
