const HeapSort = function * (values) {
  // first we need to turn the array into a max heap
  const heapify = function * (start, max) {
    var head = [start]
    while (head.length > 0) {
      var j = head.pop()
      var min = j
      var l = 2 * j + 1
      var r = 2 * j + 2

      if (l < max) {
        yield min
        yield l
        if (values[min] < values[l]) {
          min = l
        }
        yield values
      }

      if (r < max) {
        yield min
        yield r
        if (values[min] < values[r]) {
          min = r
        }
        yield values
      }

      if (min !== j) {
        var temp = values[min]
        values[min] = values[j]
        values[j] = temp

        head.push(min)
      }
    }
  }
  for (var i = Math.ceil(values.length / 2); i >= 0; i--) {
    yield * heapify(i, values.length)
  }

  for (var unsorted = values.length; unsorted > 0; unsorted--) {
    var temp = values[unsorted - 1]
    values[unsorted - 1] = values[0]
    values[0] = temp
    yield * heapify(0, unsorted - 1)
  }
}

export default HeapSort
