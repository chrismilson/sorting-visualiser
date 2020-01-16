/**
 * This script will control the canvas displaying the data and also control the
 * web-worker that is calculating the steps that the sorting algorithms go
 * through.
 */

import React from 'react'
import AlgorithmWorker from './algorithm-worker'
import './style.scss'

export default class Visualiser extends React.Component {
  constructor (props) {
    super(props)

    this.worker = new AlgorithmWorker()

    this.canvas = React.createRef()
    this.resize = this.resize.bind(this)

    this.values = new Array(props.size || 500)
    for (var i = 0; i < this.values.length; i++) {
      this.values[i] = Math.random()
    }

    this.calculated = false
  }

  componentDidMount () {
    this.ctx = this.canvas.current.getContext('2d')
    this.resize()

    this.worker.calculate('bubble sort', this.values)
      .then(moves => {
        this.calculated = true
        this.setState({ moves })
      })

    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  resize () {
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

  drawValues () {
    // clear the screen
    this.ctx.clearRect(0, 0, this.values.length, 1)

    // trace the array
    this.ctx.beginPath()

    // start point at base
    this.ctx.moveTo(0, 0)
    // Then two points per value.
    this.values.forEach((v, i) => {
      // one for the left tip of the bar
      this.ctx.lineTo(i, v)
      // one for the right
      this.ctx.lineTo(i + 1, v)
    })
    // final point at base
    this.ctx.lineTo(this.values.length, 0)
    this.ctx.closePath()

    this.ctx.fillStyle = '#57a3cf'
    this.ctx.fill()
  }

  /**
   * This function passes both the values array and an algorithm name to a web
   * worker, which calculates the moves needed to complete the sort, and then
   * sends the moves back.
   *
   * The main thread is still free to work on the UI etc. while the worker is
   * calculating the steps.
   */
  calculateMoves () {

  }

  render () {
    return <canvas ref={this.canvas} className='Visualiser'>
      Your browser does not support canvases
    </canvas>
  }
}
