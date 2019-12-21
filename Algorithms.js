const bubbleSort = (size, compare, swap) => {
  var minJ
  for (var i = 0; i < size; i = minJ) {
    minJ = size
    for (var j = size - 1; j > i; j--) {
      if (compare(j - 1, j)) {
        swap(j, j - 1)
        minJ = j
      }
    }
  }
}

const quickSort = (size, compare, swap) => {
  var l, r, start, end
  var ends = [0, size]

  while (ends.length) {
    r = ends.pop()
    l = ends.pop()

    if (l >= r - 1) continue

    start = l + 1
    end = r - 1

    while (start < end) {
      if (compare(start, l)) swap(start, end--)
      else start++
    }

    if (compare(l, start)) swap(l, start)
    else swap(l, start - 1)

    ends.push(l, start)
    ends.push(start, r)
  }
}

const mergeSort = (size, compare, swap, set, get) => {
  const extra = new Array(size)

  const divcon = (l, r) => {
    if (l >= r - 1) return

    const mid = l + Math.floor((r - l) / 2)
    divcon(l, mid)
    divcon(mid, r)

    var a = l
    var b = mid
    var cur = l

    while (a < mid && b < r) {
      if (compare(b, a)) extra[cur++] = get(a++)
      else extra[cur++] = get(b++)
    }

    while (a < mid) extra[cur++] = get(a++)

    for (cur = l; cur < b; cur++) {
      set(cur, extra[cur])
    }
  }

  divcon(0, size)
}

const shellSort = (size, compare, swap) => {
  var gap = ~~(size / 2)

  while (gap > 0) {
    for (var i = gap; i < size; i++) {
      for (var j = i; j >= gap && compare(j - gap, j); j -= gap) {
        swap(j - gap, j)
      }
    }
    gap = ~~(gap / 2)
  }
}

const heapSort = (size, compare, swap) => {
  // the array will have two parts - the sorted part and the heap part
  // first we need to make the whole array the heap part
  // It will be a min heap with the head at the end of the array.

  const heapify = (cur, max) => {
    var ext, l, r
    while (cur < max) {
      ext = cur
      l = 2 * cur + 1
      r = 2 * cur + 2

      if (l < max && compare(size - ext - 1, size - l - 1)) ext = l
      if (r < max && compare(size - ext - 1, size - r - 1)) ext = r

      if (cur === ext) return
      swap(size - cur - 1, size - ext - 1)
      cur = ext
    }
  }

  var i
  for (i = size; i >= 0; i--) heapify(i, size)
  // Then we swap the head of the heap with the end of the heap, decrease the
  // heap length by 1 and then balance the heap

  for (i = 0; i < size; i++) {
    swap(i, size - 1)
    heapify(0, size - i - 1)
  }
}

const binaryInsertionSort = (size, compare, swap, set, get) => {
  var max, l, r, m, temp
  for (max = 1; max <= size; max++) {
    l = 0
    r = max
    while (l < r) {
      m = l + Math.floor((r - l) / 2)

      if (compare(max, m)) l = m + 1
      else r = m
    }

    temp = get(max)
    for (m = max; m > l; m--) {
      set(m, get(m - 1))
    }
    set(l, temp)
  }
}

/**
 * Adapted from the listsort algorithm in python
 * http://svn.python.org/projects/python/trunk/Objects/listobject.c
 *
 * @param {number} size The size of the array
 * @param {function} compare An api to compare values at indices
 * @param {function} swap An api to swap values at two indices
 * @param {function} set An api to set the value at an index
 * @param {function} get An api to get the value at an index
 */
const timsort = (size, compare, swap, set, get) => {
  /**
   * Returns the length of the run starting at a given index.
   *
   * If the run is descending the value will be the negative length of the run.
   *
   * @param {number} lo The starting index of the run
   * @param {number} hi The run must end before this
   * @returns {number}
   */
  const countRun = (lo, hi) => {
    if (lo === hi - 1) return 1
    var n = lo + 1
    if (compare(lo, n++)) {
      // decreasing
      while (n < hi && compare(n - 1, n)) n++

      // return negative length to identify descending
      return lo - n
    }

    while (n < hi && !compare(n - 1, n)) n++
    return n - lo
  }

  /**
   *
   * @param {number} lo Starting index of search area
   * @param {number} hi First index after searching area
   * @param {number} mark The index with the value being searched for
   */
  const binarySearch = (lo, hi, mark) => {
    while (lo < hi) {
      var m = lo + Math.floor((hi - lo) / 2)

      if (compare(m, mark)) hi = m
      else lo = m + 1
    }
    return lo
  }

  /**
   * Shifts the values from a low index to a high index to the right, wrapping
   * the last value to the front
   * @param {number} lo
   * @param {number} hi
   */
  const shift = (lo, hi) => {
    for (var i = hi; i > lo; i--) {
      swap(i - 1, i)
    }
  }

  /**
   * Performs a binary insertion sort on the indices from low to high
   * @param {number} lo
   * @param {number} hi
   */
  const insertionSort = (lo, hi) => {
    for (var max = 0; max < hi; max++) {
      shift(binarySearch(lo, max, max), max)
    }
  }

  /**
   * Reverses the slice from lo to hi
   * @param {number} lo
   * @param {number} hi
   */
  const reverse = (lo, hi) => {
    for (var i = 0; i < ~~((hi - lo) / 2); i++) {
      swap(lo + i, hi - i - 1)
    }
  }

  const mergeLo = (pA, nA, pB, nB) => {
    var dest
    for (dest = 0; dest < nA; dest++) extra[dest] = get(pA + dest)

    dest = pA
    pA = 0

    while (pA < nA && nB > 0) {
      compare(dest, pB) // for the algorithm to know about the comparison
      if (extra[pA] > get(pB)) {
        swap(dest++, pB++)
        nB--
      } else {
        set(dest++, extra[pA++])
      }
    }

    while (pA < nA) set(dest++, extra[pA++])
  }

  const mergeHi = (pA, nA, pB, nB) => {
    var dest
    for (dest = 0; dest < nB; dest++) extra[dest] = get(pB + dest)

    dest = pB + nB
    while (nA > 0 && nB > 0) {
      compare(pA + nA, dest - 1)
      if (extra[nB - 1] < get(pA + nA - 1)) {
        swap(--dest, pA + --nA)
      } else {
        set(--dest, extra[--nB])
      }
    }

    while (nB > 0) set(--dest, extra[--nB])
  }

  const mergeAt = (i) => {
    var pA = pending[i].base
    var nA = pending[i].len
    var pB = pending[i + 1].base
    var nB = pending[i + 1].len

    pending[i].len = nA + nB
    if (i === pending.length - 3) {
      pending[i + 1] = pending.pop()
    } else pending.pop()

    // where does b start in a
    var m, l, r
    l = pA
    r = pA + nA
    while (l < r) {
      m = l + Math.floor((r - l) / 2)

      if (compare(pB, m)) l = m + 1
      else r = m
    }
    nA -= l - pA
    pA = l

    // where does a end in b
    l = pB
    r = pB + nB
    while (l < r) {
      m = l + Math.floor((r - l) / 2)

      if (!compare(m, pB - 1)) l = m + 1
      else r = m
    }
    nB = l - pB

    if (nA < nB) mergeLo(pA, nA, pB, nB)
    else mergeHi(pA, nA, pB, nB)
  }

  const mergeCollapse = () => {
    while (pending.length > 1) {
      var n = pending.length - 2
      if (n > 0 && pending[n - 1].len <= pending[n].len + pending[n + 1].len) {
        if (pending[n - 1].len < pending[n + 1].len) n--
        mergeAt(n)
      } else if (pending[n].len <= pending[n + 1].len) mergeAt(n)
      else break
    }
  }

  const mergeForceCollapse = () => {
    while (pending.length > 1) {
      var n = pending.length - 2
      if (n > 0 && pending[n - 1].len < pending[n + 1].len) n--
      mergeAt(n)
    }
  }

  const calculateMinRun = (n) => {
    var r = 0

    while (n >= 64) {
      r |= n & 1
      n >>= 1
    }

    return n + r
  }

  const extra = new Array(size / 2)
  var remaining = size
  var lo = 0
  var hi = size
  var pending = []
  // var minGallop = 7

  const MIN_RUN = calculateMinRun(size)
  while (remaining > 0) {
    // identify next run
    var n = countRun(lo, hi)

    // reverse if descending
    if (n < 0) {
      n *= -1
      reverse(lo, lo + n)
    }

    // If short extend out
    if (n < MIN_RUN) {
      n = Math.min(MIN_RUN, remaining)
      insertionSort(lo, lo + n)
    }

    // push run onto pending stack and maybe merge
    pending.push({ base: lo, len: n })
    console.log('------------')
    pending.forEach(run => console.log(run.base, run.len))
    mergeCollapse()

    lo += n
    remaining -= n
  }

  mergeForceCollapse()
}

const algorithms = {
  'Bubble Sort': bubbleSort,
  'Binary Insertion Sort': binaryInsertionSort,
  'Quick Sort': quickSort,
  'Merge Sort': mergeSort,
  'Shell\'s Sort': shellSort,
  'Heap Sort': heapSort,
  Timsort: timsort
}
