/**
 * Quick sort is a recursive sorting algorithm that will sort an array of n
 * comparable elements.
 *
 * Quick sort checks the length of the array:
 * - If the length is less than two, it doesn't have to do anything at all!
 * - If the length is equal to two, it just swaps them if need be.
 * - Otherwise it splits into two parts and runs quick sort on the smaller
 *   subarrays:
 *   - The values less than or equal to the very first value; and,
 *   - The values greater than the very first value.
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
 *
 * @param tracker
 */
export default function quickSort (tracker) {
  const { lessThan, swap, size } = tracker

  const rec = (lo, hi) => {
    // base cases
    if (hi - lo < 2) return
    if (hi - lo === 2) {
      if (lessThan(hi - 1, lo)) swap(hi - 1, lo)
      return
    }

    // Otherwise we split the array into two parts depending on our pivot (lo):
    // The right part will contain the values that are greater than the pivot
    // The left will contain the rest.
    var first = lo + 1
    var last = hi - 1

    // We do less than or equal so that we know which side the last value
    // belongs to.
    while (first <= last) {
      if (lessThan(lo, first)) {
        // The value belongs on the right,
        swap(first, last--)
      } else {
        // or the left.
        first++
      }
    }
    // Now the index 'first' is the first index in the right half.
    rec(lo, first)
    rec(first, hi)
  }

  rec(0, size)
}
