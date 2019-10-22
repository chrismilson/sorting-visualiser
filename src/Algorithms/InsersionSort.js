const InsersionSort = function * (values) {
  for (var sorted = 0; sorted < values.length; sorted++) {
    for (var j = sorted; j > 0; j--) {
      yield j
      yield j - 1
      if (values[j] > values[j - 1]) {
        yield values
        break
      }
      var temp = values[j]
      values[j] = values[j - 1]
      values[j - 1] = temp
      yield values
    }
  }
}

export default InsersionSort
