/**
 * Class for sorting algorithms.
 * Contains a values array, which contains floating point numbers from the half
 * open interval [0, 1).
 *
 * Also contains a swaps array which begins empty, and tells the
 */
class Sort {
  constructor (algorithm, size, ctx) {
    this.size = size
    this.orig = new Array(size).fill(0).map(a => Math.random() * 100)
    this.values = [...this.orig]
    this.algorithm = algorithm

    // this is the setup for the drawing context
    if (ctx) {
      const w = ctx.canvas.width
      const h = ctx.canvas.height
      if (w > h) {
        ctx.scale(w / size, -h / 100)
        ctx.translate(0, -100)
      } else {
        ctx.rotate(Math.PI / 2)
        ctx.scale(h / size, w / 100)
        ctx.translate(0, -100)
      }
      this.ctx = ctx
    } else this.render = undefined
    // we should be able to do everythin except render with no drawing context,
    // so we just unset the render method if we are not given a context
  }

  /**
   * An API for sorting algorithms to use that keeps track of the number of
   * swaps and comparisons.
   *
   * A given algorithm should not modify the values array, instead it should
   * implement this method to do it instead.
   *
   * @param {number} i The index of the current value
   * @param {number} j The index of the value being compared
   * @param {boolean} swap Whether the values should be swapped
   */
  _comp (i, j) {
    if (this.values[i] > this.values[j]) {
      this.state = this.actions.push({
        i: j, j: i, type: 'compare'
      })
      return true
    }
    this.state = this.actions.push({
      i, j, type: 'compare'
    })
    return false
  }

  _swap (i, j) {
    const temp = this.values[i]
    this.values[i] = this.values[j]
    this.values[j] = temp

    this.state = this.actions.push({
      i, j, type: 'swap'
    })
  }

  _set (idx, value) {
    this.state = this.actions.push({
      idx, value, prev: this.values[idx], type: 'set'
    })
    this.values[idx] = value
  }

  _get (idx) {
    return this.values[idx]
  }

  calculate () {
    this.actions = []

    this.algorithm(
      this.size,
      this._comp.bind(this),
      this._swap.bind(this),
      this._set.bind(this),
      this._get.bind(this)
    )

    this.reset()
  }

  /**
   * Simulates a step of the sort.
   */
  next () {
    if (this.state < this.actions.length) {
      const action = this.actions[this.state++]
      switch (action.type) {
        case 'compare':
          this.compareCount++
          break
        case 'swap':
          const temp = this.values[action.i]
          this.values[action.i] = this.values[action.j]
          this.values[action.j] = temp
          this.swapCount++
          break
        case 'set':
          this.values[action.idx] = action.value
          this.setCount++
      }
      return true
    }
    return false
  }

  hasNext () {
    return this.state < this.actions.length
  }

  prev () {
    if (this.state > 0) {
      const action = this.actions[--this.state]
      switch (action.type) {
        case 'compare':
          this.compareCount--
          break
        case 'swap':
          const temp = this.values[action.i]
          this.values[action.i] = this.values[action.j]
          this.values[action.j] = temp
          this.swapCount--
          break
        case 'set':
          this.values[action.idx] = action.prev
          this.setCount--
      }
      return true
    }
    return false
  }

  hasPrev () {
    return this.state > 0
  }

  /**
   * Resets the array to its original value
   */
  reset () {
    for (var i = 0; i < this.size; i++) {
      this.values[i] = this.orig[i]
    }
    this.state = 0
    this.compareCount = this.swapCount = this.setCount = 0
  }

  /**
   * When supplied a drawing context, will display the current values along the
   * screen.
   */
  render () {
    // clear the screen
    this.ctx.clearRect(0, 0, this.size, 100)

    // draw all the blue bars as a single polygon
    this.ctx.fillStyle = 'rgb(87, 163, 207)'
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    for (var i = 0; i < this.size; i++) {
      this.ctx.lineTo(i, this.values[i])
      this.ctx.lineTo(i + 1, this.values[i])
    }
    this.ctx.lineTo(this.size, 0)
    this.ctx.fill()

    if (this.state > 0 && this.state < this.actions.length) {
      const action = this.actions[this.state - 1]

      switch (action.type) {
        case 'compare':
          this.ctx.fillStyle = 'rgb(255, 0, 0)'
          this.ctx.fillRect(action.i, 0, 1, this.values[action.i])

          this.ctx.fillStyle = 'rgb(0, 255, 0)'
          this.ctx.fillRect(action.j, 0, 1, this.values[action.j])
          break
        case 'swap':
          this.ctx.fillStyle = 'rgb(0, 255, 255)'
          this.ctx.fillRect(action.i, 0, 1, this.values[action.i])
          this.ctx.fillRect(action.j, 0, 1, this.values[action.j])
          break
        case 'set':
          this.ctx.fillStyle = 'rgb(255, 255, 0)'
          this.ctx.fillRect(action.idx, 0, 1, action.value)
          break
      }
    }
  }

  setAlgorithm (algorithm) {
    this.reset()
    this.algorithm = algorithm

    this.calculate()
  }

  randomise () {
    for (var i = 0; i < this.size; i++) {
      this.values[i] = this.orig[i] = Math.random() * 100
    }
    this.state = 0

    this.calculate()
  }

  reverse () {
    var i
    for (i = this.size - 1; i >= 0; i--) {
      this.orig[i] = this.values[this.size - i - 1]
    }
    for (var i = 0; i < this.size; i++) {
      this.values[i] = this.orig[i]
    }

    this.calculate()
  }

  resize (newSize) {
    this.orig = new Array(newSize).fill(0)
    this.values = new Array(newSize).fill(0)

    for (var i = 0; i < newSize; i++) {
      this.orig[i] = this.values[i] = Math.random() * 100
    }

    this.ctx.scale(this.size / newSize, 1)

    this.size = newSize
    this.calculate()
  }
}
