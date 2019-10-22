const RadixSort = function * (values) {
  var bin0, bin1

  var left = [0]
  var right = [values.length]
  var depth = [0]

  while (left.length > 0) {
    bin0 = []
    bin1 = []
    var l = left.pop()
    var r = right.pop()
    var d = depth.pop()
    if (l === r) continue

    for (var i = l; i < r; i++) {
      if (values[i].toString(2)[d + 2] === '0') {
        yield i
        yield -1
        bin0.push(values[i])
      } else {
        yield -1
        yield i
        bin1.push(values[i])
      }
      yield values
    }
    if (bin1.length > 1) {
      left.push(l + bin0.length)
      right.push(r)
      depth.push(d + 1)
    }
    if (bin0.length > 1) {
      left.push(l)
      right.push(l + bin0.length)
      depth.push(d + 1)
    }
    values.splice(l, r - l, ...bin0, ...bin1)
  }
}

export default RadixSort
