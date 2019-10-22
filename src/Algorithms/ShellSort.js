const ShellSort = function * (values) {
  /**
   * Marcin Ciura's gap sequence for shell sort.
   */
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1]

  for (var g = 0; g < gaps.length; g++) {
    var gap = gaps[g]
    // the first gap - 1 elements are apriori gap sorted
    for (var i = gaps[g]; i < values.length; i++) {
      var temp = values[i]
      var j

      for (j = i; j >= gap && values[j - gap] > temp; j -= gap) {
        yield j
        yield j - gap
        values[j] = values[j - gap]
        yield values
      }
      values[j] = temp
    }

    // temp = a[i]
    // # shift earlier gap-sorted elements up until the correct location for a[i] is found
    // for (j = i; j >= gap and a[j - gap] > temp; j -= gap)
    // {
    //     a[j] = a[j - gap]
    // }
    // # put temp (the original a[i]) in its correct location
    // a[j] = temp
  }
}

export default ShellSort
