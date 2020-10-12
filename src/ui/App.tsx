import React, { useState, useEffect, useRef, useCallback } from 'react'
import Display from './components/Display'
import Menu from './components/Menu'
import useValues from './hooks/use-values'
import useAlgorithms from './hooks/use-algorithms'
import useToggle from './hooks/use-toggle'
import useBlock from './hooks/use-block'
import { algorithmNames as sortNames } from '../sort/algorithms/sort'
import { algorithmNames as unsortNames } from '../sort/algorithms/unsort'
import { Direction, Move } from '../sort/types'
import './App.scss'
import Stats from './components/Stats'

const App: React.FC = () => {
  const [direction, changeDirection] = useToggle(
    Direction.FORWARD,
    Direction.BACKWARD
  )
  const [play, setPlay] = useState(false)
  const [displayStats, setDisplayStats] = useState(false)
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

  // Try to prevent screen lock with the Screen WakeLock API
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    let cleaned = false

    if (play) {
      navigator.wakeLock?.request('screen').then(sentinel => {
        if (cleaned) {
          sentinel.release()
        } else {
          lock = sentinel
          console.log('obtained screen lock.')
        }
      })
    }

    return () => {
      cleaned = true
      if (lock) {
        lock.release()
        console.log('released screen lock.')
      }
    }
  }, [play])

  const handleRestart = useCallback(
    timeToRestart => {
      changeDirection(Direction.FORWARD)
      setPlay(false)
      block()

      return new Promise(resolve =>
        sort?.animateUntilCompletion(timeToRestart, Direction.BACKWARD, {
          onCompletion: () => {
            unblock()
            resolve()
          }
        })
      )
    },
    [block, unblock, sort, changeDirection]
  )

  return (
    <div className="App">
      <Menu
        restart={{
          disabled: blocking || !sort,
          keyStr: 'r',
          handler: () => {
            handleRestart(1000)
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
        stats={{
          keyStr: 's',
          handler: () => setDisplayStats(v => !v)
        }}
        sizeUp={{
          keyCode: 38,
          handler: () => {
            // Any changes in size, should stop execution of the sort and clear the
            // currently painted move.
            setPlay(false)
            moveRef.current = undefined
            setSize(Math.min(maxSize, size + 1))
          }
        }}
        sizeDown={{
          keyCode: 40,
          handler: () => {
            // Any changes in size, should stop execution of the sort and clear the
            // currently painted move.
            setPlay(false)
            moveRef.current = undefined
            setSize(Math.max(minSize, size - 1))
          }
        }}
        unsort={{
          disabled: blocking,
          list: unsortNames,
          handler: algorithm => {
            if (unsortNames.includes(algorithm)) {
              setPlay(false)
              changeDirection(Direction.FORWARD)

              unsortWith(algorithm, block, unblock)
            }
          }
        }}
        sort={{
          current: sortString,
          list: sortNames,
          handler: algorithm => {
            if (algorithm !== sortString) {
              moveRef.current = undefined
              const wasPlaying = play
              handleRestart(400).then(() => {
                setSort(algorithm)
                setPlay(wasPlaying)
              })
            }
          }
        }}
      />
      <Stats stats={sort?.statistics} display={displayStats} />
      <Display values={values} moveRef={moveRef} untracker={sort} />
    </div>
  )
}

export default App
