import { Algorithm } from '.'

const quickSort: Algorithm = ({ swap, compare, size }) => {
  const partition = (low: number, high: number) => {
    const pivot = low

    let i = high
    for (let j = high; j > pivot; j--) {
      if (compare(pivot, j) < 0) swap(j, i--)
    }

    swap(pivot, i)
    return i
  }

  const sort = (low: number, high: number) => {
    if (low < high) {
      const mid = partition(low, high)
      sort(low, mid - 1)
      sort(mid + 1, high)
    }
  }

  sort(0, size - 1)
}

export default quickSort
