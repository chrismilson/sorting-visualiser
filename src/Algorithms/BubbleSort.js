const BubbleSort = function * (values) {
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values.length - i - 1; j++) {
      if (values[j] < values[j + 1]) {
        var temp = values[j]
        values[j] = values[j + 1]
        values[j + 1] = temp
      }
      yield j
      yield j + 1
      yield values
    }
  }
}

export default BubbleSort
