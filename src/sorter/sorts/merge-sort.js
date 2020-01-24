/**
 * Merge sort is a recursive (specifically divide and conquer) type sorting
 * algorithm:
 *
 * It first splits the data in half, sorts both halves separately and then
 * merges the two sorted halves.
 */
export default function mergeSort ({ compare, malloc, free, memcpy, size }) {
  const divcon = (start, end) => {
    // singletons and empty arrays are sorted already
    if (end - start <= 1) return

    // doing (start + end) / 2 may cause integer overflow
    const mid = start + Math.floor((end - start) / 2)
    divcon(start, mid)
    divcon(mid, end)

    // Now the sub arrays from start to mid and mid to end are sorted
    // individually by assumption, so we will merge them into a new array.
    const extra = malloc(end - start)

    var left = start
    var right = mid
    var copy = 0

    while (left < mid && right < end) {
      // if the next value in the left half is smaller, move that to the memory.
      // Otherwise copy the right value.
      if (compare(left, right) < 0) {
        memcpy(left++, copy++, 'values', extra)
      } else {
        memcpy(right++, copy++, 'values', extra)
      }
    }

    // then copy all the values back.
    memcpy(0, start, extra, 'values', end - start)

    // we are done with the extra memory now
    free(extra)
  }

  divcon(0, size)
}

mergeSort.title = 'Merge Sort'
