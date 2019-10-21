import BubbleSort from './BubbleSort'
import MergeSortDF from './MergeSortDF'
import MergeSortBF from './MergeSortBF'

export default {
  BubbleSort: {
    algorithm: BubbleSort,
    name: 'Bubble sort'
  },
  MergeSortBF: {
    algorithm: MergeSortBF,
    name: 'Breadth first merge sort'
  },
  MergeSortDF: {
    algorithm: MergeSortDF,
    name: 'Depth first merge sort'
  }
}
