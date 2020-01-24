/**
 * Calculates the moves for a bubble sort on abstracted data.
 * Information about the data is obtained from the Tracker API.
 */
export default function bubbleSort ({ compare, swap, size }) {
  var streak
  for (var i = 0; i < size; i += streak) {
    streak = 1
    for (var j = size - 1; j > i; j--) {
      if (compare(j, j - 1) < 0) {
        streak = 1
        swap(j, j - 1)
      } else streak++
    }
  }
}

bubbleSort.title = 'Bubble Sort'
