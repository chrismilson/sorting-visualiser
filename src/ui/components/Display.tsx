import React, { useCallback } from 'react'
import useCanvas, { DrawingMethod } from 'react-hooks-use-drawing-canvas'
import Move, { MoveType } from '../../sort/Move'
import Untracker from '../../sort/Untracker'
import './Display.scss'

/** continuously displays values on the screen */
const Display: React.FC<{
  values: number[]
  moveRef: React.MutableRefObject<Move | undefined>
  untracker?: Untracker
}> = props => {
  const { values, moveRef, untracker } = props

  const draw = useCallback<DrawingMethod>(
    ctx => {
      // resize the pixels, not just a maths transform
      ctx.canvas.width = ctx.canvas.height = values.length
      ctx.setTransform(1, 0, 0, -1, 0, values.length)

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
            {
              const { i, j } = move
              ctx.save()
              ctx.fillStyle = 'cyan'
              ctx.fillRect(i.index, 0, 1, i.value)
              ctx.fillRect(j.index, 0, 1, j.value)
              ctx.restore()

              // We make sure that the values are repainted on the next frame by
              // setting the current value to NaN.
              currentValues[i.index] = currentValues[j.index] = NaN
            }
            break
          case MoveType.COMPARE:
            {
              const { i, j, result } = move

              const color = ['lime', 'orange', 'red']
              ctx.save()
              ctx.fillStyle = color[1 + result]
              ctx.fillRect(i.index, 0, 1, i.value)

              ctx.fillStyle = color[1 - result]
              ctx.fillRect(j.index, 0, 1, j.value)
              ctx.restore()

              currentValues[i.index] = currentValues[j.index] = NaN
            }
            break
          case MoveType.MEMCPY:
            {
              const { from, to, value } = move

              ctx.save()
              ctx.fillStyle = 'gold'
              ctx.fillRect(from.index, 0, 1, value)
              ctx.fillRect(to.index, 0, 1, value)

              ctx.restore()

              currentValues[from.index] = currentValues[to.index] = NaN
            }
            break
        }
      }

      let frame: number
      const drawFrame = () => {
        frame = requestAnimationFrame(drawFrame)
        // check the main values
        for (let i = 0; i < values.length; i++) {
          if (currentValues[i] !== values[i]) {
            ctx.clearRect(i, 0, 1, values.length)
            ctx.fillRect(i, 0, 1, values[i])
            currentValues[i] = values[i]
          }
        }

        // then the extra memory
        untracker?.forEachInExtra((_buffer, index, value) => {
          ctx.save()
          ctx.globalAlpha = 0.2
          ctx.fillStyle = 'purple'

          ctx.fillRect(index, 0, 1, value)
          // repaint the extra values each time
          currentValues[index] = NaN

          ctx.restore()
        })

        drawMove()
      }

      drawFrame()

      return () => {
        cancelAnimationFrame(frame)
      }
    },
    [values, moveRef, untracker]
  )

  const canvasRef = useCanvas(draw)

  return <canvas className="Display" ref={canvasRef} />
}

export default Display
