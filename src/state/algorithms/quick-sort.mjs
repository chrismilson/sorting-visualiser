/**
 * Quick sort is a recursive sorting algorithm that will sort an array of n
 * comparable elements.
 *
 * @param tracker
 */
export default function quickSort (tracker) {
  const { lessThan, swap, size } = tracker

  const rec = (lo, hi) => {
    // base cases
    if (hi - lo < 1) return
    if (hi - lo === 1) {
      if (lessThan(hi, lo)) swap(hi, lo)
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
