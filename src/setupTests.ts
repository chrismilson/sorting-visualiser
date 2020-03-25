/* eslint-disable @typescript-eslint/no-namespace */
import '@testing-library/jest-dom/extend-expect'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSorted(): R
    }
  }
}

expect.extend({
  toBeSorted(received: number[]) {
    let pass = true
    for (let i = 1; i < received.length; i++) {
      if (received[i - 1] > received[i]) {
        pass = false
        break
      }
    }

    const message = () => {
      return `Expected ${received} to ${pass ? 'not ' : ''}be sorted`
    }

    return { message, pass }
  }
})
