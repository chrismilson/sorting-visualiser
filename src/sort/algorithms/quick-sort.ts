import { Algorithm } from '.'

const quickSort: Algorithm = ({ swap, compare, size }) => {
  const rec = (lo: number, hi: number) => {
    // Base case is either:
    // - There are no elements to check; or,
    if (hi - lo < 2) return
    // - There are two elements to check.
    if (hi - lo === 2) {
      if (compare(lo, lo + 1) > 0) swap(lo, lo + 1)
      return
    }

    const pivot = lo
    let less = pivot + 1
    let more = hi - 1
    while (less < more) {
      if (compare(pivot, less) < 0) {
        swap(less, more)
        more--
      } else {
        less++
      }
    }

    // now we have two sections.
    // lo <-> less are all less than or equal to pivot
    // more <-> hi are all greater than pivot
    rec(lo, less)
    rec(more, hi)
  }

  rec(0, size)
}

export default quickSort
