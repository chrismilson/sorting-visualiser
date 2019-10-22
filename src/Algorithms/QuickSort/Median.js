const QuickSort = function * (values) {
  var p // index of pivot - set in partition function

  const median = function (left, right) {
    var v = values.slice(left, right + 1)
    v = v.map((v, i) => [v, i])
    v.sort((a, b) => b[0] - a[0])
    return left + v[~~(v.length / 2)][1]
  }

  const partition = function * (left, right) {
    var med = median(left, right)
    var pivot = values[med]
    values[med] = values[right]
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
