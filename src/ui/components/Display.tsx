import React, { useCallback } from 'react'
import useCanvas, { DrawingMethod } from 'react-hooks-use-drawing-canvas'
import './Display.scss'
import Move, { MoveType } from '../../sort/Move'

/** continuously displays values on the screen */
const Display: React.FC<{
  values: number[]
  moveRef: React.MutableRefObject<Move | undefined>
}> = props => {
  const { values, moveRef } = props

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

      const drawMove = () => {
        const move = moveRef.current
        if (!move) return
        switch (move.type) {
          case MoveType.SWAP:
            ctx.save()
            ctx.fillStyle = 'cyan'
            ctx.fillRect(move.i, 0, 1, currentValues[move.i])
            ctx.fillRect(move.j, 0, 1, currentValues[move.j])
            ctx.restore()

            // We make sure that the values are repainted on the next frame by
            // setting the current value to NaN.
            currentValues[move.i] = currentValues[move.j] = NaN
            break
          case MoveType.COMPARE:
            const color = ['lime', 'orange', 'red']
            ctx.save()
            ctx.fillStyle = color[1 + move.result]
            ctx.fillRect(move.i, 0, 1, currentValues[move.i])

            ctx.fillStyle = color[1 - move.result]
            ctx.fillRect(move.j, 0, 1, currentValues[move.j])
            ctx.restore()

            // We make sure that the values are repainted on the next frame by
            // setting the current value to NaN.
            currentValues[move.i] = currentValues[move.j] = NaN
            break
        }
      }

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
        drawMove()
      }

      drawFrame()

      return () => {
        cancelAnimationFrame(frame)
      }
    },
    [values, moveRef]
  )

  const canvasRef = useCanvas(draw)

  return <canvas className="Display" ref={canvasRef} />
}

export default Display
