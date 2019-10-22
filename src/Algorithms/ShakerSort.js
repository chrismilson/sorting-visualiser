const ShakerSort = function * (values) {
  var left = 0
  var right = values.length - 1

  const wipe = function * (start, end) {
    let inc
    if (start > end) {
      inc = -1
    } else {
      inc = 1
    }
    for (var i = start; inc * i < inc * end; i += inc) {
      yield i
      yield i + inc
      if (inc * values[i] > inc * values[i + inc]) {
        var temp = values[i]
        values[i] = values[i + inc]
        values[i + inc] = temp
      }
      yield values
    }
  }
  while (left < right) {
    yield * wipe(left, right--)
    yield * wipe(right, left++)
  }
}

export default ShakerSort
