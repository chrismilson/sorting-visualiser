/**
 * This script will control the canvas displaying the data and also control the
 * web-worker that is calculating the steps that the sorting algorithms go
 * through.
 */

import React from 'react'
import Simulator from './algorithm-simulator'
import './style.scss'

export default class Visualiser extends React.Component {
  constructor (props) {
    super(props)

    this.calculate = new Simulator().calculate

    this.canvas = React.createRef()
    this.resize = this.handleResize.bind(this)

    this.values = new Array(props.size)
    for (var i = 0; i < props.size; i++) {
      this.values[i] = Math.random()
    }
    this.orig = [...this.values]

    this.calculated = false
    this.calculate('bubble sort', this.values)
      .then(moves => {
        this.calculated = true
        this.moveIdx = -1
        this.setState({ moves })
      })

    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount () {
    this.ctx = this.canvas.current.getContext('2d')
    this.handleResize()

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.animationFrame)
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate () {
    if (this.calculated) {
      this.animate()
    }
  }

  /**
   * Resets the drawing context dimensions.
   *
   * Used when the screen is resized to make sure the content fits the window.
   */
  handleResize () {
    const width = this.ctx.canvas.width = 2 * this.canvas.current.offsetWidth
    const height = this.ctx.canvas.height = 2 * this.canvas.current.offsetHeight

    if (width > height) {
      // base on the bottom, smallest at the left
      this.ctx.setTransform(
        width / this.values.length, 0, 0,
        -height, 0, height
      )
    } else {
      // base on the right, smallest at the top
      this.ctx.setTransform(
        0, height / this.values.length, -width,
        0, width, 0
      )
    }

    // redraw
    this.drawValues()
  }

  /**
   * Draws all of the values in the array from 'from' to 'to'.
   * User can also specify color.
   *
   * defaults to painting all values in color '#57a3cf'
   */
  drawValues (style = '#57a3cf', from = 0, to = this.values.length) {
    // trace the array
    this.ctx.beginPath()

    // start point at base
    this.ctx.moveTo(from, 0)
    // Then two points per value.
    for (var i = from; i < to; i++) {
      // one for the left tip of the bar
      this.ctx.lineTo(i, this.values[i])
      // one for the right
      this.ctx.lineTo(i + 1, this.values[i])
    }
    // final point at base
    this.ctx.lineTo(this.values.length, 0)
    this.ctx.closePath()

    this.ctx.fillStyle = style
    this.ctx.fill()
  }

  /**
   * Draws the single value at a given index in a given color.
   * @param {string} color
   * @param {number} idx
   */
  drawValue (style, idx) {
    this.ctx.fillStyle = style
    this.ctx.fillRect(idx, 0, 1, this.values[idx])
  }

  /**
   * clears the screen ready for a new frame.
   */
  clearScreen () {
    this.ctx.clearRect(0, 0, this.values.length, 1)
  }

  /**
   * Displays the current move if valid.
   */
  drawMove () {
    if (this.moveIdx < 0 || this.moveIdx >= this.state.moves.length) return
    const move = this.state.moves[this.moveIdx]

    switch (move.type) {
      case 'swap':
        this.drawValue('cyan', move.i)
        this.drawValue('cyan', move.j)
        break
      case 'compare':
        this.drawValue('green', move.i)
        this.drawValue('red', move.j)
        break
      default:
    }
  }

  /**
   * fully redraws the screen with all the values and the current move.
   */
  redraw () {
    this.clearScreen()
    this.drawValues()
    this.drawMove()
  }

  /**
   * Move the internal state forward by one move. This involves modifying the
   * values for swap moves, for example.
   *
   * Returns true when the algorithm completed a move.
   */
  next () {
    if (this.moveIdx++ >= this.state.moves.length - 1) return false

    const move = this.state.moves[this.moveIdx]

    switch (move.type) {
      case 'swap':
        const temp = this.values[move.i]
        this.values[move.i] = this.values[move.j]
        this.values[move.j] = temp
        break
      default:
    }
    return true
  }

  /**
   * Moves the internal state back by one move. This involves undoing the
   * previous move executed by next.
   *
   * Returns true after sucessfully reversing.
   */
  prev () {
    if (this.moveIdx < 0) return false
    if (this.moveIdx >= this.state.moves.length) {
      // there is no move here, just decrement and continue
      this.moveIdx--
      return true
    }
    const move = this.state.moves[this.moveIdx--]

    switch (move.type) {
      case 'swap':
        const temp = this.values[move.i]
        this.values[move.i] = this.values[move.j]
        this.values[move.j] = temp
        break
      default:
    }
    return true
  }

  animate () {
    if (!this.props.animate) window.cancelAnimationFrame(this.animationFrame)

    const step = this.props.reverse ? this.prev : this.next

    for (var i = 0; i < this.props.speed; i++) {
      step()
    }
    // if the last step is valid request another frame
    if (step()) {
      this.animationFrame = window.requestAnimationFrame(() => this.animate())
    }

    this.redraw()
  }

  /**
   * Resets the values array to its original state.
   */
  reset () {
    for (var i = 0; i < this.values.length; i++) {
      this.values[i] = this.orig[i]
    }
    this.moveIdx = -1
  }

  render () {
    return (
      <canvas ref={this.canvas} className='Visualiser'>
        Your browser does not support canvases
      </canvas>
    )
  }
}

Visualiser.defaultProps = {
  size: 100,
  speed: 1,
  move: -1
}
