import React, { useCallback } from 'react'
import useCanvas, { DrawingMethod } from 'react-hooks-use-drawing-canvas'
import './Display.css'

/** continuously displays values on the screen */
const Display: React.FC<{
  values: number[]
}> = props => {
  const { values } = props

  const draw = useCallback<DrawingMethod>(
    ctx => {
      // resize the pixels, not just a maths transform
      ctx.canvas.width = ctx.canvas.height = values.length
      ctx.setTransform(1, 0, 0, -values.length, 0.5, values.length)

      ctx.lineWidth = 1

      ctx.strokeStyle = 'rgb(87,163,207)'
      // ctx.strokeStyle = '#57A3CF'

      let frame: number
      const drawFrame = () => {
        ctx.clearRect(0, 0, values.length, 1)

        ctx.beginPath()
        values.forEach((value, index) => {
          ctx.moveTo(index, 0)
          ctx.lineTo(index, value)
        })
        ctx.closePath()
        ctx.stroke()

        frame = requestAnimationFrame(drawFrame)
      }

      drawFrame()

      return () => {
        cancelAnimationFrame(frame)
      }
    },
    [values]
  )

  const canvasRef = useCanvas(draw)

  return <canvas className="Display" ref={canvasRef} />
}

export default Display
