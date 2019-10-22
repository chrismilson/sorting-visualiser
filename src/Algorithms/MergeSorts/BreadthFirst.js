/**
 * A breadth first merge sort algorithm
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

  for (var size = 1; size < values.length; size *= 2) {
    for (var left = 0; left < values.length - size; left += size * 2) {
      var mid = left + size
      var right = Math.min(left + size * 2, values.length)
      yield * merge(left, mid, right)
    }
  }
}

export default MergeSort
