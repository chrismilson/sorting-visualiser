/* global getComputedStyle */

import React from 'react'

import './Array.scss'

class Array extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    var dpi = window.devicePixelRatio
    var style = getComputedStyle(this.refs.canvas)
    this.refs.canvas.setAttribute(
      'width',
      this.width = (style.getPropertyValue('width').slice(0, -2) * dpi)
    )
    this.refs.canvas.setAttribute(
      'height',
      this.height = (style.getPropertyValue('height').slice(0, -2) * dpi)
    )

    const ctx = this.refs.canvas.getContext('2d')

    if (this.width < this.height) {
      ctx.translate(0, this.height)
      ctx.rotate(-Math.PI / 2)

      var temp = this.width
      this.width = this.height
      this.height = temp
    } else {
      ctx.translate(this.width, 0)
      this.width *= -1
    }

    this.barWidth = 10 * this.width / (11 * this.props.nums.length - 1)

    ctx.fillStyle = '#57a3cf'
    ctx.save()

    for (var i = 0; i < this.props.nums.length; i++) {
      ctx.fillRect(
        i * 11 * this.barWidth / 10,
        this.props.nums[i] * this.height,
        this.barWidth,
        this.height
      )
    }
  }

  componentDidUpdate () {
    const ctx = this.refs.canvas.getContext('2d')
    this.barWidth = 10 * this.width / (11 * this.props.nums.length - 1)

    ctx.clearRect(0, 0, this.width, this.height)

    for (var i = 0; i < this.props.nums.length; i++) {
      ctx.fillRect(
        i * 11 * this.barWidth / 10,
        this.props.nums[i] * this.height,
        this.barWidth,
        this.height
      )
    }

    if (this.props.check) {
      ctx.fillStyle = '#cf9757'
      ctx.fillRect(
        this.props.check * 11 * this.barWidth / 10,
        this.props.nums[this.props.check] * this.height,
        this.barWidth,
        this.height
      )
      ctx.restore()
      ctx.save()
    }
    if (this.props.compare) {
      ctx.fillStyle = '#57cf63'
      ctx.fillRect(
        this.props.compare * 11 * this.barWidth / 10,
        this.props.nums[this.props.compare] * this.height,
        this.barWidth,
        this.height
      )
      ctx.restore()
      ctx.save()
    }
  }

  render () {
    return (
      <div className='Array'>
        <canvas
          ref='canvas'
        />
      </div>
    )
  }
}

export default Array
