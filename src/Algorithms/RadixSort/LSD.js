const RadixSort = function * (values) {
  var depth = Math.ceil(Math.log2(values.length))

  while (depth > 0) {
    var bin0 = []
    var bin1 = []

    for (var i = 0; i < values.length; i++) {
      if (values[i].toString(2)[depth + 2] === '0') {
        yield -1
        yield i
        bin0.push(values[i])
      } else {
        yield i
        yield -1
        bin1.push(values[i])
      }
      yield values
    }

    yield 0
    yield bin0.length
    values = [...bin0, ...bin1]
    yield values

    depth -= 1
  }

  //   def sort(array, radix=10):
  //   if len(array) == 0:
  //     return array

  //   # Determine minimum and maximum values
  //   minValue = array[0];
  //   maxValue = array[0];
  //   for i in range(1, len(array)):
  //     if array[i] < minValue:
  //       minValue = array[i]
  //     elif array[i] > maxValue:
  //       maxValue = array[i]

  //   # Perform counting sort on each exponent/digit, starting at the least
  //   # significant digit
  //   exponent = 1
  //   while (maxValue - minValue) / exponent >= 1:
  //     array = countingSortByDigit(array, radix, exponent, minValue)
  //     exponent *= radix

  //   return array

  // def countingSortByDigit(array, radix, exponent, minValue):
  //   bucketIndex = -1
  //   buckets = [0] * radix
  //   output = [None] * len(array)

  //   # Count frequencies
  //   for i in range(0, len(array)):
  //     bucketIndex = math.floor(((array[i] - minValue) / exponent) % radix)
  //     buckets[bucketIndex] += 1

  //   # Compute cumulates
  //   for i in range(1, radix):
  //     buckets[i] += buckets[i - 1]

  //   # Move records
  //   for i in range(len(array) - 1, -1, -1):
  //     bucketIndex = math.floor(((array[i] - minValue) / exponent) % radix)
  //     buckets[bucketIndex] -= 1
  //     output[buckets[bucketIndex]] = array[i]

//   return output
}

export default RadixSort
