/**
 * This script will control the canvas displaying the data and also control the
 * web-worker that is calculating the steps that the sorting algorithms go
 * through.
 */

import React from 'react'
import './style.scss'

export default class Visualiser extends React.Component {
  constructor (props) {
    super(props)

    this.canvas = React.createRef()
    this.resize = this.resize.bind(this)
  }

  componentDidMount () {
    this.ctx = this.canvas.current.getContext('2d')
    this.resize()

    window.addEventListener('resize', this.resize)
  }

  resize () {
    this.ctx.canvas.width = this.width = this.canvas.current.offsetWidth
    this.ctx.canvas.height = this.height = this.canvas.current.offsetHeight
  }

  render () {
    return <canvas ref={this.canvas} className='Visualiser'>
      Your browser does not support canvases
    </canvas>
  }
}
