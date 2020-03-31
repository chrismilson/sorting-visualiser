import { Algorithm } from '.'

interface Chunk {
  base: number
  size: number
}

class MergeState {
  pending: Chunk[] = []
}

/**
 * Adapted from the listsort algorithm in python
 * http://svn.python.org/projects/python/trunk/Objects/listobject.c
 */
const timsort: Algorithm = ({ compare, swap, malloc, memcpy, free, size }) => {
  /**
   * Returns the length of a run starting at a given index (up to a given
   * index).
   *
   * If the run is descending the value will be the negative length of the run.
   */
  const countRun = (low: number, high: number) => {
    if (low === high - 1) return 1
    let n = low + 1
    if (compare(low, n) < 0) {
      while (n < high && compare(n - 1, n) > 0) n++
      // returns negative to signify decending run
      return low - n
    }
    while (n < high && compare(n - 1, n) < 0) n++
    return n - low
  }

  const gallopLeft = (
    mark: number,
    from: number,
    length: number,
    hint: number
  ) => {
    // hint is used in the galloping version of timsort
    void hint

    let offset = 0
    while (offset < length && compare(mark, from + offset) > 0) {
      offset++
    }

    return offset
  }

  const gallopRight = (
    mark: number,
    from: number,
    length: number,
    hint: number
  ) => {
    // hint is used in the galloping version of timsort
    void hint

    let offset = 0
    while (offset < length && compare(mark, from + length - offset - 1) < 0) {
      offset++
    }
    return offset
  }

  /**
   * Finds the index of a value (or the index a value should be inserted at) in
   * sorted data.
   */
  const binarySearch = (low: number, high: number, mark: number) => {
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)

      if (compare(mark, mid) < 0) high = mid
      else low = mid + 1
    }

    return low
  }

  /**
   * Shifts values to the right, wrapping the last value to the front.
   */
  const shift = (low: number, high: number) => {
    for (let i = high; i > low; i--) swap(i - 1, i)
  }

  /**
   * Performs a binary insertion sort on a chunk.
   */
  const insertionSort = (low: number, high: number) => {
    for (let i = low; i < high; i++) shift(binarySearch(low, i, i), i)
  }

  /**
   * Reverses a chunk.
   */
  const reverse = (low: number, high: number) => {
    const mid = Math.floor((high - low) / 2)
    for (let i = 0; i < mid; i++) swap(low + i, high - i - 1)
  }

  /**
   * Timsort's merge low method
   *
   * @param pA The first index of the A buffer
   * @param nA The length of the A buffer
   * @param pB The first index of the B buffer
   * @param nB the length of the B buffer
   */
  const mergeLo = (pA: number, nA: number, pB: number, nB: number) => {
    // copy the A buffer into extra memory
    const buffer = malloc(nA)
    for (let index = 0; index < nA; index++) {
      memcpy(pA + index, { buffer, index })
    }

    let destination = pA
    pA = 0 // this is now the index in extra memory

    while (pA < nA && nB > 0) {
      if (compare({ buffer, index: pA }, pB) < 0) {
        memcpy({ buffer, index: pA++ }, destination++)
      } else {
        memcpy(pB++, destination++)
        nB--
      }
    }

    while (pA < nA) memcpy({ buffer, index: pA++ }, destination++)

    free(buffer)
  }

  /**
   * Timsort's merge high method
   *
   * @param pA The first index of the A buffer
   * @param nA The length of the A buffer
   * @param pB The first index of the B buffer
   * @param nB the length of the B buffer
   */
  const mergeHi = (pA: number, nA: number, pB: number, nB: number) => {
    // copy the B buffer into memory
    const buffer = malloc(nB)
    for (let index = 0; index < nB; index++) {
      memcpy(pB + index, { buffer, index })
    }

    let destination = pB + nB

    while (nA > 0 && nB > 0) {
      if (compare({ buffer, index: nB - 1 }, pA + nA - 1) > 0) {
        memcpy({ buffer, index: --nB }, --destination)
      } else {
        memcpy(pA + --nA, --destination)
      }
    }
    while (nB > 0) memcpy({ buffer, index: --nB }, --destination)

    free(buffer)
  }

  const mergeAt = (mergeState: MergeState, i: number) => {
    const { base: pA, size: nA } = mergeState.pending[i]
    const { base: pB, size: nB } = mergeState.pending[i + 1]

    // record the length of the combined runs.
    mergeState.pending[i].size = nA + nB
    // remove the chunk that will be merged.
    mergeState.pending.splice(i + 1, 1)

    // Where does b start in a? Elements before that can be ignored.
    const ignoreAtFront = gallopLeft(pB, pA, nA, 0)

    const ignoreAtBack = gallopRight(pA + nA - 1, pB, nB, nB - 1)

    const merge = nA - ignoreAtFront <= nB - ignoreAtBack ? mergeHi : mergeLo
    merge(pA + ignoreAtFront, nA - ignoreAtFront, pB, nB - ignoreAtBack)
  }

  const mergeCollapse = (mergeState: MergeState) => {
    const { pending } = mergeState
    while (pending.length > 1) {
      console.log([...mergeState.pending])
      let n = pending.length - 2
      if (
        n > 0 &&
        pending[n - 1].size <= pending[n].size + pending[n + 1].size
      ) {
        if (pending[n - 1].size < pending[n + 1].size) n -= 1
        mergeAt(mergeState, n)
      } else if (pending[n].size <= pending[n + 1].size) {
        mergeAt(mergeState, n)
      } else break
    }
  }

  const mergeForceCollapse = (mergeState: MergeState) => {
    const { pending } = mergeState
    while (pending.length > 1) {
      let n = pending.length - 2
      if (n > 0 && pending[n - 1].size < pending[n + 1].size) n -= 1
      mergeAt(mergeState, n)
    }
  }

  /** Calculates the optimal minimum length of a run. */
  const calculateMinRun = (length: number) => {
    let r = 0 // becomes 1 if any 1 bits are shifted off.

    while (length >= 64) {
      r |= length & 1
      length >>= 1
    }

    return length + r
  }

  const mergeState = new MergeState()
  let remaining = size
  let low = 0

  const MIN_RUN = calculateMinRun(size)
  while (remaining > 0) {
    let n = countRun(low, size)

    // reverse if descending
    if (n < 0) {
      n *= -1
      reverse(low, low + n)
    }

    // exdend if too short
    if (n < MIN_RUN) {
      n = Math.min(MIN_RUN, remaining)
      insertionSort(low, low + n)
    }

    // push run onto pending stack and maybe merge
    mergeState.pending.push({
      base: low,
      size: n
    })
    mergeCollapse(mergeState)

    low += n
    remaining -= n
  }
  mergeForceCollapse(mergeState)
}

export default timsort
