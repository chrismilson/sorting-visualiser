import { Algorithm, Index } from '../../types'

interface Slice {
  base: number
  len: number
}

class MergeState {
  pending: Slice[] = []
  minGallop = 7
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
    if (compare(low, n) > 0) {
      while (n < high && compare(n - 1, n) > 0) n++
      // returns negative to signify decending run
      return low - n
    }
    while (n < high && compare(n - 1, n) <= 0) n++
    return n - low
  }

  /**
   * Simmilar to binary search, except first finds a good lower and upper bound
   * before searching.
   */
  const gallopLeft = (
    mark: number | Index,
    from: number,
    length: number,
    hint: number,
    fromBuffer?: number
  ) => {
    /** Wraps an index to from with the specified buffer if needed. */
    const indexFrom = fromBuffer
      ? (index: number) => ({ buffer: fromBuffer, index })
      : (index: number) => index
    const base = from + hint
    let lastOffset = 0
    let offset = 1

    if (compare(indexFrom(base), mark) < 0) {
      // mark should be somwhere in [hint, size]
      const maxOffset = length - hint
      while (
        offset < maxOffset &&
        compare(indexFrom(base + offset), mark) < 0
      ) {
        lastOffset = offset
        offset = (offset << 1) + 1
        if (offset <= 0) offset = maxOffset
      }
      if (offset > maxOffset) offset = maxOffset
      // translate so that offset is relative to from not base
      lastOffset = hint + lastOffset
      offset = hint + offset
    } else {
      const maxOffset = hint
      while (
        offset < maxOffset &&
        compare(indexFrom(base - offset), mark) >= 0
      ) {
        lastOffset = offset
        offset = (offset << 1) + 1
        if (offset <= 0) offset = maxOffset
      }
      if (offset > maxOffset) offset = maxOffset
      // translate so that offset is relative to from not base and lastOffset <
      // offset
      const temp = lastOffset
      lastOffset = hint - offset
      offset = hint - temp
    }

    while (lastOffset < offset) {
      const mid = lastOffset + ((offset - lastOffset) >> 1)
      if (compare(indexFrom(from + mid), mark) < 0) lastOffset = mid + 1
      else offset = mid
    }
    return offset
  }

  const gallopRight = (
    mark: number | Index,
    from: number,
    length: number,
    hint: number,
    /** optionally set the buffer that from should access */
    fromBuffer?: number
  ) => {
    /** Wraps an index to from with the specified buffer if needed. */
    const indexFrom = fromBuffer
      ? (index: number) => ({ buffer: fromBuffer, index })
      : (index: number) => index
    const base = from + hint
    let lastOffset = 0
    let offset = 1

    if (compare(indexFrom(base), mark) < 0) {
      const maxOffset = length - hint
      while (
        offset < maxOffset &&
        compare(indexFrom(base + offset), mark) < 0
      ) {
        lastOffset = offset
        offset = (offset << 1) + 1
        if (offset <= 0) offset = maxOffset
      }
      if (offset > maxOffset) offset = maxOffset
      // translate so that offset is relative to from not base
      lastOffset += hint
      offset += hint
    } else {
      const maxOffset = hint
      while (
        offset < maxOffset &&
        compare(indexFrom(base - offset), mark) >= 0
      ) {
        lastOffset = offset
        offset = (offset << 1) + 1
        if (offset <= 0) offset = maxOffset
      }
      if (offset > maxOffset) offset = maxOffset
      // translate so that offset is relative to from not base and lastOffset <
      // offset
      const temp = lastOffset
      lastOffset = hint - offset
      offset = hint - temp
    }

    while (lastOffset < offset) {
      const mid = lastOffset + ((offset - lastOffset) >> 1)
      if (compare(indexFrom(from + mid), mark) < 0) lastOffset = mid + 1
      else offset = mid
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
  const mergeLo = (
    mergeState: MergeState,
    pA: number,
    nA: number,
    pB: number,
    nB: number
  ) => {
    // copy the A buffer into extra memory
    const buffer = malloc(nA)
    for (let index = 0; index < nA; index++) {
      memcpy(pA + index, { buffer, index })
    }

    let destination = pA
    pA = 0 // this is now the index in extra memory
    let countA = 0
    let countB = 0

    const gallop = () => {
      while (
        nA > 0 &&
        nB > 0 &&
        (countA >= mergeState.minGallop || countB >= mergeState.minGallop)
      ) {
        if (mergeState.minGallop) mergeState.minGallop -= 1

        countA = gallopRight(pB, pA, nA, 0, buffer)
        for (let i = 0; i < countA; i++) {
          memcpy({ buffer, index: pA++ }, destination++)
        }
        nA -= countA
        // if (nA === 0) return

        countB = gallopLeft({ buffer, index: pA }, pB, nB, 0)
        for (let i = 0; i < countB; i++) {
          memcpy(pB++, destination++)
        }
        nB -= countB
        // if (nB === 0) return
      }
      mergeState.minGallop += 1
    }

    while (nA > 0 && nB > 0) {
      if (compare({ buffer, index: pA }, pB) < 0) {
        memcpy({ buffer, index: pA++ }, destination++)
        nA -= 1
        countA += 1
        countB = 0
      } else {
        memcpy(pB++, destination++)
        nB -= 1
        countA = 0
        countB += 1
      }
      // One run is winning so consistently that galloping may be a huge win.
      if (countA + countB >= mergeState.minGallop) gallop()
    }

    while (nA-- > 0) memcpy({ buffer, index: pA++ }, destination++)

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
  const mergeHi = (
    mergeState: MergeState,
    pA: number,
    nA: number,
    pB: number,
    nB: number
  ) => {
    // copy the B buffer into memory
    const buffer = malloc(nB)
    for (let index = 0; index < nB; index++) {
      memcpy(pB + index, { buffer, index })
    }

    let destination = pB + nB
    let countA = 0 // number of times A won in a row
    let countB = 0 // number of times B won in a row

    const gallop = () => {
      while (
        nA > 0 &&
        nB > 0 &&
        (countA >= mergeState.minGallop || countB >= mergeState.minGallop)
      ) {
        if (mergeState.minGallop) mergeState.minGallop -= 1
        countA = nA - gallopRight({ buffer, index: nB - 1 }, pA, nA, nA - 1)
        for (let i = 0; i < countA; i++) {
          memcpy(pA + --nA, --destination)
        }
        // if (nA === 0) return

        countB = nB - gallopLeft(pA + nA - 1, 0, nB, nB - 1, buffer)
        for (let i = 0; i < countB; i++) {
          memcpy({ buffer, index: --nB }, --destination)
        }
        // if (nB === 0) return
      }
      // punishment for not gallopping anymore
      mergeState.minGallop += 1
    }

    while (nA > 0 && nB > 0) {
      if (compare({ buffer, index: nB - 1 }, pA + nA - 1) <= 0) {
        memcpy(pA + --nA, --destination)
        countA += 1
        countB = 0
      } else {
        memcpy({ buffer, index: --nB }, --destination)
        countA = 0
        countB += 1
      }
      // One run is winning so consistently that galloping may be a huge win.
      if (countA + countB >= mergeState.minGallop) gallop()
    }
    while (nB > 0) memcpy({ buffer, index: --nB }, --destination)

    free(buffer)
  }

  /** Merges two slices */
  const mergeAt = (mergeState: MergeState, i: number) => {
    const { pending } = mergeState
    let pA = pending[i].base
    let nA = pending[i].len
    const pB = pending[i + 1].base
    let nB = pending[i + 1].len

    // record the length of the combined runs.
    pending[i].len = nA + nB
    // remove the chunk that will be merged.
    pending.splice(i + 1, 1)

    // Where does b start in a? Elements before that can be ignored.
    const ignoreAtFront = gallopRight(pB, pA, nA, 0)
    pA += ignoreAtFront
    nA -= ignoreAtFront

    nB = gallopLeft(pA + nA - 1, pB, nB, nB - 1)

    const merge = nA <= nB ? mergeLo : mergeHi
    merge(mergeState, pA, nA, pB, nB)
  }

  const mergeCollapse = (mergeState: MergeState) => {
    const { pending } = mergeState
    while (pending.length > 1) {
      let n = pending.length - 2
      if (n > 0 && pending[n - 1].len <= pending[n].len + pending[n + 1].len) {
        if (pending[n - 1].len < pending[n + 1].len) n -= 1
        mergeAt(mergeState, n)
      } else if (pending[n].len <= pending[n + 1].len) {
        mergeAt(mergeState, n)
      } else break
    }
  }

  const mergeForceCollapse = (mergeState: MergeState) => {
    const { pending } = mergeState
    while (pending.length > 1) {
      let n = pending.length - 2
      if (n > 0 && pending[n - 1].len < pending[n + 1].len) n -= 1
      mergeAt(mergeState, n)
    }
  }

  /** Calculates the optimal minimum length of a run. */
  const calculateMinRun = (length: number) => {
    let r = 0 // becomes 1 if any 1 bits are shifted off.

    // The true version of timsort uses 64 as a max, min size, we will use 16 so
    // that the merging can be seen at smaller sizes
    // while (length >= 64) {
    while (length >= 16) {
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
      len: n
    })
    mergeCollapse(mergeState)

    low += n
    remaining -= n
  }
  mergeForceCollapse(mergeState)
}

export default timsort
