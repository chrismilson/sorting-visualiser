import { Algorithm } from '.'

/**
 * Quick sort is a recursive sorting algorithm that will sort an array of `n`
 * comparable elements.
 *
 * Quick sort works on subarrays:
 * - It chooses a "pivot", any single element in the subarray. The pivot can be
 *   chosen arbitrarily, but difference choices will lead to different runtimes
 *   on different data.
 * - It then partitions the subarray into three portions:
 *   - A subarray of the elements less than or equal to than the pivot;
 *   - The pivot; and,
 *   - A subarray of the elements larger than the pivot.
 * - Then it runs the algorithm again on the two subarrays.
 *
 * Since the subarrays are smaller, the depth will be at most the length of the
 * array (if the smallest value in the array is the first element in every
 * subarray; the array was sorted already) and the sort will finish. Giving us a
 * worst case of O(n^2) time complexity.
 *
 * On average for random data however the split will be closer to the middle and
 * in the best case we will have half the values in each part. Thus in our best
 * case we will have O(n log(n)) time complexity.
 *
 * Since we are recursing, we will have O(1) space for each layer in the
 * recursion, so the worst case for our space complexity will be O(n).
 *
 * In the best case however we will have less layers alive at any one time,
 * meaning our space complexity would be O(log(n)).
 */
const quickSort: Algorithm = ({ swap, compare, size }) => {
  const partition = (low: number, high: number) => {
    const pivot = low

    let i = high
    for (let j = high; j > pivot; j--) {
      if (compare(pivot, j) < 0) swap(j, i--)
    }

    swap(pivot, i)
    return i
  }

  const sort = (low: number, high: number) => {
    if (low < high) {
      const mid = partition(low, high)
      sort(low, mid - 1)
      sort(mid + 1, high)
    }
  }

  sort(0, size - 1)
}

export default quickSort
