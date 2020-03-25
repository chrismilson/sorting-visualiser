import React, { useCallback } from 'react'
import useCanvas, { DrawingMethod } from 'react-hooks-use-drawing-canvas'

/** continuously displays values on the screen */
const Display: React.FC<{
  values: number[]
}> = props => {
  const { values } = props

  const draw = useCallback<DrawingMethod>(
    (ctx, width, height) => {
      let frame: number
      ctx.setTransform(width / values.length, 0, 0, -height, 0, height)

      ctx.lineWidth = 1

      ctx.strokeStyle = 'rgb(87,163,207)'
      // ctx.strokeStyle = '#57A3CF'

      const drawFrame = () => {
        ctx.clearRect(0, 0, width, height)

        ctx.beginPath()
        values.forEach((value, index) => {
          ctx.moveTo(index + 0.5, 0)
          ctx.lineTo(index + 0.5, value)
        })
        ctx.closePath()
        ctx.stroke()

        frame = requestAnimationFrame(drawFrame)
      }

      drawFrame()

      return () => {
        console.log('cleaned up')
        cancelAnimationFrame(frame)
      }
    },
    [values]
  )

  const canvasRef = useCanvas(draw)

  return <canvas className="Display" ref={canvasRef} />
}

export default Display
