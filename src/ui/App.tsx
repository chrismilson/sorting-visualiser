import React, { useState, useEffect, useRef } from 'react'
import Display from './components/Display'
import Menu from './components/Menu'
import useValues from './hooks/use-values'
import useAlgorithms from './hooks/use-algorithms'
import useToggle from './hooks/use-toggle'
import useBlock from './hooks/use-block'
import sortingAlgorithms from '../sort/algorithms/sort'
import unsortingAlgorithms from '../sort/algorithms/unsort'
import { Direction, Move } from '../sort/types'
import './App.scss'

const App: React.FC = () => {
  const [direction, changeDirection] = useToggle(
    Direction.FORWARD,
    Direction.BACKWARD
  )
  const [play, setPlay] = useState(false)
  const { blocking, block, unblock } = useBlock()

  /** The number of steps per frame is exponential in speed */
  const minSpeed = -10
  const maxSpeed = 10
  const [speed, setSpeed] = useState(-4)

  /** The length of the values array is exponantial in size */
  const minSize = 3
  const maxSize = 20
  const [size, setSize] = useState(12)

  const values = useValues(Math.floor(Math.pow(1.5, size)))

  const { unsortWith, sort, setSort, sortString } = useAlgorithms(values)

  const moveRef = useRef<Move | undefined>()
  useEffect(() => {
    moveRef.current = undefined
    // Any blocking action occurring will refresh the current move.
  }, [moveRef, blocking])

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
  }, [play, sort, speed, direction, changeDirection, moveRef])

  return (
    <div className="App">
      <Menu
        restart={{
          disabled: blocking || !sort,
          keyStr: 'r',
          handler: () => {
            changeDirection(Direction.FORWARD)
            setPlay(false)
            block()

            sort?.animateUntilCompletion(1000, Direction.BACKWARD, {
              onCompletion: () => unblock()
            })
          }
        }}
        speedDown={{
          disabled: blocking || !sort,
          // if playing leftArrow decreases speed
          keyCode: play ? 37 : undefined,
          handler: () => setSpeed(Math.max(minSpeed, speed - 1))
        }}
        stepBack={{
          disabled: blocking || !sort,
          // if not playing leftArrow steps back
          keyCode: play ? undefined : 37,
          handler: () => {
            moveRef.current = sort?.step(Direction.BACKWARD)
          }
        }}
        play={{
          disabled: blocking || !sort,
          handler: () => setPlay(!play),
          keyStr: ' ',
          status: play
        }}
        reverse={{
          disabled: blocking || !sort,
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
          disabled: blocking || !sort,
          // if not playing rightArrow steps forward
          keyCode: play ? undefined : 39,
          handler: () => {
            moveRef.current = sort?.step(Direction.FORWARD)
          }
        }}
        speedUp={{
          disabled: blocking || !sort,
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
        unsort={{
          disabled: blocking,
          list: Object.keys(unsortingAlgorithms),
          handler: algorithm => {
            if (algorithm in unsortingAlgorithms) {
              setPlay(false)
              changeDirection(Direction.FORWARD)

              unsortWith(algorithm, block, unblock)
            }
          }
        }}
        sort={{
          current: sortString,
          list: Object.keys(sortingAlgorithms),
          handler: algorithm => {
            if (algorithm in sortingAlgorithms && algorithm !== sortString) {
              moveRef.current = undefined
              unsortWith('nothing')
              setSort(algorithm)
            }
          }
        }}
      />
      <Display values={values} moveRef={moveRef} untracker={sort} />
    </div>
  )
}

export default App
