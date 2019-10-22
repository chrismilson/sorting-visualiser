const QuickSort = function * (values) {
  var p // index of pivot - set in partition function

  const partition = function * (left, right) {
    // to use a random pivot, we get a random element in the array and move it
    // to the end, then do normal partition
    var mid = ~~((left + right) / 2)
    var pivot = values[mid]
    values[mid] = values[right]
    values[right] = pivot

    p = left
    for (var j = left; j < right; j++) {
      yield p
      yield j
      if (values[j] < pivot) {
        var temp = values[p]
        values[p] = values[j]
        values[j] = temp
        p += 1
      }
      yield values
    }

    values[right] = values[p]
    values[p] = pivot
  }

  var left = [0]
  var right = [values.length - 1]

  while (left.length > 0) {
    var l = left.pop()
    var r = right.pop()

    if (l < r) {
      yield * partition(l, r)

      left.push(l)
      right.push(p - 1)
      left.push(p + 1)
      right.push(r)
    }
  }
}

export default QuickSort
