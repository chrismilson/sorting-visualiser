/**
 * Bubble sort is a sorting algorithm that will sort an array of n comparable
 * elements.
 *
 * Bubble sort works by checking adjacent values. If the right value is less
 * than the left value, it swaps them. Otherwise it leaves them alone.
 *
 * After one pass of the entire array from the end to the beginning, the
 * smallest element in the array will be at the front. Then the pairs are all
 * checked again (but not the definitely sorted part).
 *
 * Since we only have one element sorted each pass, we will have to make a pass
 * for each (next smallest) element in the array, leading to a 'sum of the
 * numbers up to n' style time complexity, which is O(n^2).
 *
 * The space complexity however is very simple, we only keep track of the number
 * of definitely sorted values and our position in the current pass. This means
 * we have O(1) space complexity.
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
