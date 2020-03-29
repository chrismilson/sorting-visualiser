import React, { useCallback } from 'react'
import useCanvas, { DrawingMethod } from 'react-hooks-use-drawing-canvas'
import './Display.scss'

/** continuously displays values on the screen */
const Display: React.FC<{
  values: number[]
}> = props => {
  const { values } = props

  const draw = useCallback<DrawingMethod>(
    ctx => {
      // resize the pixels, not just a maths transform
      ctx.canvas.width = ctx.canvas.height = values.length
      ctx.setTransform(1, 0, 0, -values.length, 0, values.length)

      ctx.fillStyle = 'rgb(87,163,207)'

      const currentValues = [...values]
      values.forEach((value, index) => {
        ctx.fillRect(index, 0, 1, value)
      })

      let frame: number
      const drawFrame = () => {
        frame = requestAnimationFrame(drawFrame)
        for (let i = 0; i < values.length; i++) {
          if (currentValues[i] !== values[i]) {
            ctx.clearRect(i, 0, 1, 1)
            ctx.fillRect(i, 0, 1, values[i])
            currentValues[i] = values[i]
          }
        }
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
