/**
 * Bubble sort is a sorting algorithm that will sort an array of comparable
 * elements.
 *
 * Bubble sort works by checking adjacent values. If the right value is less
 * than the left value, it swaps them. Otherwise it leaves them alone.
 *
 * After one pass of the entire array from the end to the beginning, the
 * smallest element in the array will be at the front. Then the pairs are all
 * checked again (but not the definitely sorted part)
 * @param tracker
 */
export default function bubbleSort (tracker) {
  const { swap, lessThan, size } = tracker

  for (var i = 0; i < size; i++) {
    for (var j = size - 1; j > i; j--) {
      if (lessThan(j - 1, j)) swap(j - 1, j)
    }
  }
}
