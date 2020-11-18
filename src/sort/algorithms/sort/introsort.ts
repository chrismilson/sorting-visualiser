import { Algorithm } from '../../types'

/**
 * Introsort is a hybrid sorting algorithm developed for the C++ standard
 * library by David Musser.
 *
 * It starts with quick sort, and then switches to heap sort (if the recursion
 * depth exceeds some bound), or insertion sort (if the partition size is less
 * than some bound).
 */
const introSort: Algorithm = ({ compare, swap, size }) => {
  const INSERTION_SORT_THRESHOLD = 16

  // It is more likely that introsort will avoid heap sort for longer, but for
  // the sizes of array in this application, the depth will never reach that
  // point, and the user will not experience the heap sort part of the
  // algorithm.
  const HEAP_SORT_THRESHOLD = Math.floor((Math.log2(size) * 3) / 4)

  /**
   * Does a binary search on the subarray [lo:hi] for insertion point of the
   * target value (passed as an index).
   */
  const bisect = (lo: number, hi: number, target: number) => {
    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1)
      if (compare(mid, target) < 0) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }
    return lo
  }

  /**
   * Sorts the subarray [lo:hi] with insertion sort.
   */
  const insertionSort = (lo: number, hi: number) => {
    for (let i = 1; i < hi - lo; i++) {
      // Find where the next unsorted element should go.
      const j = bisect(lo, lo + i, lo + i)

      // Swap elements to bubble it down to where it should be.
      for (let k = lo + i; k > j; k--) {
        swap(k, k - 1)
      }
    }
  }

  /**
   * Bubbles the value in the heap down to retain heap substructure.
   */
  const heapify = (base: number, root: number, max: number) => {
    while (true) {
      const left = 2 * root + 1
      const right = 2 * root + 2
      let extreme = root

      if (left < max && compare(base + extreme, base + left) < 0) {
        extreme = left
      }

      if (right < max && compare(base + extreme, base + right) < 0) {
        extreme = right
      }

      if (extreme === root) {
        return
      }

      swap(base + root, base + extreme)
      root = extreme
    }
  }

  /**
   * Sorts the subarray [lo:hi] with heapsort.
   */
  const heapSort = (lo: number, hi: number) => {
    let n = hi - lo

    // Heapify the subarray
    for (let i = n - 1; i >= 0; i--) {
      heapify(lo, i, n)
    }

    while (n > 1) {
      swap(lo, lo + n - 1)
      heapify(lo, 0, n - 1)
      n -= 1
    }
  }

  // Chooses a pivot in the partition from lo to hi by selecting three random
  // elements and taking their median.
  const findPivot = (lo: number, hi: number) => {
    const n = 3
    const candidates = Array(3)
      .fill(0)
      .map(() => lo + Math.floor(Math.random() * (hi - lo)))

    candidates.sort((i, j) => compare(i, j))
    return candidates[n >> 1]
  }

  const quickSort = (lo: number, hi: number, depth: number) => {
    if (hi - lo < INSERTION_SORT_THRESHOLD) {
      insertionSort(lo, hi)
      return
    }
    if (depth > HEAP_SORT_THRESHOLD) {
      heapSort(lo, hi)
      return
    }

    const pivot = findPivot(lo, hi)
    swap(pivot, lo)

    // Now we partition the subarray.
    let left = lo + 1
    let right = hi - 1

    while (left < right) {
      while (left < right && compare(left, lo) <= 0) {
        left += 1
      }
      while (left < right && compare(lo, right) < 0) {
        right -= 1
      }
      swap(left, right)
    }

    // Left may point to the last element in the left half or the first element
    // in the second half.
    if (compare(lo, left) < 0) {
      left -= 1
    }

    swap(lo, left)
    // we now have two new sections:
    // - [lo:left] which contains all elements less than or equal to the pivot.
    // - [left:hi] which contains all elements more than the pivot.

    quickSort(lo, left + 1, depth + 1)
    quickSort(left + 1, hi, depth + 1)
  }

  quickSort(0, size, 1)
}

export default introSort
