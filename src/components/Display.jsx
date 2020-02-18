import React, { useLayoutEffect, useRef, useState } from 'react'
import './Display.scss'

/**
 * This method, when given a react reference to a canvas dom element, will
 * return a drawing context for that canvas.
 *
 * Html drawing contexts have three effective dimensions:
 *
 * 1. **The dimension of the canvas it is contained in** is determined by the
 * styles on the page. It defaults to 300x150 pixels.
 *
 * 2. **The dimension of the drawing context in pixels** is set separately and
 *    defines how many pixels are in the drawing context. This is separate to
 *    the size of the canvas in pixels (although often set to be the same). The
 *    drawing is painted into the context with only these pixels, and then
 *    transformed, by the page style, into the dimension of the canvas it is
 *    contained in.
 *
 * 3. **The transformed dimension of the drawing context** is the dimension that
 *    the code uses to draw in.
 *
 * For example, we can have a canvas that is 300x150 pixels, with a drawing
 * context that is 10x10 pixels and is transformed to the range
 * [10, 20]x[100, 200]. We could then do the fillRect(14, 140, 2, 20) and we
 * would then see a 2x1 rectangle painted in the middle of our canvas, with one
 * side significantly more blurry than the rest (due to the antialiasing).
 *
 * This method, will return a drawing context that:
 *
 * 1. Does not change the original dimension of the containing canvas.
 * 2. Changes the pixel dimension of the context to match the *actual* dimension
 *    of the canvas in the dom.
 * 3. Transforms the context so that we can draw in the range [0, width]x[0,
 *    height] (where width and height both default to 1).
 *
 * @param {*} canvasRef
 * @param {number} [width] Transformed context width
 * @param {number} [height] Transformed context height
 */
function useDrawingContext (canvasRef, width = 1, height = 1) {
  const [ctx, setCtx] = useState()

  useLayoutEffect(() => {
    setCtx(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  useLayoutEffect(() => {
    if (!ctx) return

    /** The width of the canvas container in pixels */
    const pxWidth = canvasRef.current.offsetWidth
    /** The height of the canvas container in pixels */
    const pxHeight = canvasRef.current.offsetHeight

    // we set the dimension of the context so that it matches the dimension of
    // the containing canvas.
    ctx.canvas.width = pxWidth
    ctx.canvas.height = pxHeight

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

/**
 * This method, when passed a drawing context and an array of values will draw
 * the values into the context.
 *
 * @param {*} ctx The drawing context
 * @param {*} values The values to be displayed
 */
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
  const ctx = useDrawingContext(canvasRef, values.length)

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
