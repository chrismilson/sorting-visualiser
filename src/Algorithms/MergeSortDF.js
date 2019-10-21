/**
 * A depth first merge sort algorithm.
 * @param {number[]} values
 */
const MergeSort = function * (values) {
  const merge = function * (left, mid, right) {
    var temp
    if (left + 1 === right) {
      yield left
      yield right
      if (values[left] > values[right]) {
        temp = values[left]
        values[left] = values[right]
        values[right] = temp
      }
      yield values
    } else {
      var l = left
      var r = mid
      while (l < r && r < right) {
        yield l
        yield r
        if (values[l] > values[r]) {
          temp = values[r]
          for (var i = r; i > l; i--) {
            values[i] = values[i - 1]
          }
          values[l] = temp
          r++
        }
        l++
        yield values
      }
    }
  }

  var left = []
  var right = []
  const depth = (l, r) => {
    if (l + 1 === r) return
    var mid = ~~((l + r) / 2)
    left.push(l)
    right.push(r)

    depth(mid, r)
    depth(l, mid)
  }
  depth(0, values.length)

  while (left.length > 0) {
    var l = left.pop()
    var r = right.pop()
    yield * merge(l, ~~((l + r) / 2), r)
  }
}

export default MergeSort
