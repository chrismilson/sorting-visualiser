const SelectionSort = function * (values) {
  var max, maxIdx
  for (var i = 0; i < values.length; i++) {
    max = values[0]
    maxIdx = 0
    for (var j = 1; j < values.length - i - 1; j++) {
      yield maxIdx
      yield j
      if (values[j] > max) {
        max = values[j]
        maxIdx = j
      }
      yield values
    }
    values[maxIdx] = values[values.length - i - 1]
    values[values.length - i - 1] = max
  }
}

export default SelectionSort
