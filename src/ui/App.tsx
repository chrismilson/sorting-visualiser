import React, { useState, useEffect, useRef } from 'react'
import Display from './components/Display'
import Menu from './components/Menu'
import useValues from './hooks/use-values'
import useAlgorithm, { useAlgorithmAsync } from './hooks/use-algorithm'
import useToggle from './hooks/use-toggle'
import shuffleAlgorithm from '../sort/algorithms/shuffle'
import sortingAlgorithm from '../sort/algorithms/tim-sort'
import Direction from '../sort/Direction'
import Move from '../sort/Move'
import './App.scss'

const App: React.FC = () => {
  const [direction, changeDirection] = useToggle(
    Direction.FORWARD,
    Direction.BACKWARD
  )
  const [play, setPlay] = useState(false)
  const [blocking, setBlocking] = useState(false)

  /** The number of steps per frame is exponential in speed */
  const minSpeed = -10
  const maxSpeed = 10
  const [speed, setSpeed] = useState(-4)

  /** The length of the values array is exponantial in size */
  const minSize = 3
  const maxSize = 20
  const [size, setSize] = useState(12)

  const values = useValues(Math.floor(Math.pow(1.5, size)))

  const shuffle = useAlgorithm(shuffleAlgorithm, values)

  const sort = useAlgorithmAsync(sortingAlgorithm, values)

  const moveRef = useRef<Move | undefined>()
  useEffect(() => {
    moveRef.current = undefined
    // Any blocking action occurring will refresh the current move.
  }, [moveRef, blocking])

  useEffect(() => {
    setBlocking(true)
    setPlay(false)
    changeDirection(Direction.FORWARD)
    shuffle.reset()
    return shuffle.animateUntilCompletion(2000, Direction.FORWARD, {
      onCompletion: () => {
        setBlocking(false)
      }
    })
  }, [shuffle, changeDirection])

  useEffect(() => {
    if (play) {
      return sort?.animateStepsPerFrame(Math.pow(1.3, speed), direction, {
        onCompletion: () => {
          setPlay(false)
          changeDirection()
          moveRef.current = undefined
        },
        moveRef
      })
    }
  }, [play, sort, speed, direction, changeDirection])

  // useEffect(() => {
  //   if (!play) moveRef.current = undefined
  // }, [play])

  return (
    <div className="App">
      <Menu
        restart={{
          keyStr: 'r',
          handler: () => {
            changeDirection(Direction.FORWARD)
            setPlay(false)
            setBlocking(true)

            sort?.animateUntilCompletion(1000, Direction.BACKWARD, {
              onCompletion: () => setBlocking(false)
            })
          }
        }}
        speedDown={{
          // if playing leftArrow decreases speed
          keyCode: play ? 37 : undefined,
          handler: () => setSpeed(Math.max(minSpeed, speed - 1))
        }}
        stepBack={{
          // if not playing leftArrow steps back
          keyCode: play ? undefined : 37,
          handler: () => {
            if (!blocking) moveRef.current = sort?.step(Direction.BACKWARD)
          }
        }}
        play={{
          handler: () => setPlay(!play),
          status: play,
          disabled: blocking
        }}
        reverse={{
          keyStr: '`',
          handler: () => {
            const oppositeDirection =
              direction === Direction.BACKWARD
                ? Direction.FORWARD
                : Direction.BACKWARD
            if (sort?.hasStep(oppositeDirection)) changeDirection()
          },
          status: direction === Direction.BACKWARD
        }}
        stepForward={{
          // if not playing rightArrow steps forward
          keyCode: play ? undefined : 39,
          handler: () => {
            if (!blocking) moveRef.current = sort?.step(Direction.FORWARD)
          }
        }}
        speedUp={{
          // if playing rightArrow increases speed
          keyCode: play ? 39 : undefined,
          handler: () => setSpeed(Math.min(maxSpeed, speed + 1))
        }}
        sizeUp={{
          keyCode: 38,
          handler: () => setSize(Math.min(maxSize, size + 1))
        }}
        sizeDown={{
          keyCode: 40,
          handler: () => setSize(Math.max(minSize, size - 1))
        }}
      />
      <Display values={values} moveRef={moveRef} untracker={sort} />
    </div>
  )
}

export default App
