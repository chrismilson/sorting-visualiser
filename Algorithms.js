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

const shellSort = (size, compare, swap, set, get) => {
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

const algorithms = {
  'Bubble Sort': bubbleSort,
  'Quick Sort': quickSort,
  'Merge Sort': mergeSort,
  'Shell\'s Sort': shellSort
}
