import bubbleSort from './bubble-sort'
import mergeSort from './merge-sort'

/**
 * Returns an object where the keys are the title values of the objects in the
 * array.
 * @param {Object[]} array
 * @param {string} array.title
 */
const arrayToObject = array => {
  return Object.fromEntries(array.map(item => [item.title, item]))
}

// exports an object where the values are the algorithm implementations and the
// keys are the high level names of the algorithms
export default arrayToObject([
  bubbleSort,
  mergeSort
])
