import React, { useLayoutEffect, useRef, useState } from 'react'
import './Display.scss'

function useContext (canvasRef, width = 1, height = 1) {
  const [ctx, setCtx] = useState()

  useLayoutEffect(() => {
    setCtx(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  useLayoutEffect(() => {
    if (!ctx) return

    // this is the pixel width of the canvas on screen; we want the drawing
    // context pixels to match that of the screen.
    const pxWidth = ctx.canvas.width = canvasRef.current.offsetWidth
    const pxHeight = ctx.canvas.height = canvasRef.current.offsetHeight

    if (pxWidth > pxHeight) {
      // The origin is at the bottom left corner.
      ctx.setTransform(
        0, -pxHeight / height,
        pxWidth / width, 0,
        0, pxHeight
      )
    } else {
      // The origin is at the top right corner.
      ctx.setTransform(
        -pxWidth / height, 0,
        0, pxHeight / width,
        pxWidth, 0
      )
    }
  }, [ctx, width, height])

  return ctx
}

function drawValues (ctx, values) {
  ctx.beginPath()
  ctx.moveTo(0, 0)

  values.forEach((v, i) => {
    ctx.lineTo(v, i)
    ctx.lineTo(v, i + 1)
  })
  ctx.lineTo(0, values.length)
  ctx.closePath()

  ctx.fillStyle = '#57a3cf'
  ctx.fill()
}

/**
 * When supplied with a values array, it will display the current values in the
 * array at all times; each frame, the current state of the array will be
 * painted to the screen.
 *
 * The values array may be mutated elsewhere and the mutated values will be
 * displyed.
 *
 * @param {Object} props
 * @param {number[]} props.values
 */
export default function Display (props) {
  const { values } = props
  const canvasRef = useRef()
  const ctx = useContext(canvasRef, values.length)

  useLayoutEffect(() => {
    if (!ctx) return
    let animationFrame

    const draw = () => {
      ctx.clearRect(0, 0, values.length, 1)

      drawValues(ctx, values)

      // drawMove(ctx, move)

      window.requestAnimationFrame(draw)
    }
    draw()
    return () => { window.cancelAnimationFrame(animationFrame) }
  }, [values, ctx])

  return <canvas className='Display' ref={canvasRef} />
}
