import React, { useState } from 'react'
import {
  FaRedoAlt,
  FaBackward,
  FaStepBackward,
  FaPlay,
  FaSyncAlt,
  FaForward,
  FaStepForward,
  FaEllipsisV,
  FaPlus,
  FaMinus,
  FaPause
} from 'react-icons/fa'
import Button, { IconButton } from './Button'
import './Menu.scss'

interface ButtonProps {
  handler: () => void
  keyStr?: string
  keyCode?: number
  disabled?: boolean
}

interface AlgorithmProps {
  current: string
  list: string[]
  handler(key: string): void
}

const Menu: React.FC<{
  reverse: ButtonProps & { status: boolean }
  restart: ButtonProps
  speedDown: ButtonProps
  stepBack: ButtonProps
  play: ButtonProps & { status: boolean }
  stepForward: ButtonProps
  speedUp: ButtonProps
  sizeUp: ButtonProps
  sizeDown: ButtonProps
  unsort: AlgorithmProps
  sort: AlgorithmProps
}> = ({
  reverse: { status: reverseStatus, ...reverse },
  restart,
  speedDown,
  stepBack,
  play: { status: playStatus, ...play },
  stepForward,
  speedUp,
  sizeUp,
  sizeDown,
  unsort,
  sort
}) => {
  const [spinning, setSpinning] = useState(false)
  const [extra, setExtra] = useState(false)

  return (
    <div className="Menu">
      <IconButton
        name="restart"
        Icon={FaRedoAlt}
        style={
          spinning
            ? {
                transition: 'transform 300ms',
                transform: `rotate(${360}deg)`
              }
            : {}
        }
        onTransitionEnd={() => setSpinning(false)}
        {...restart}
        handler={() => {
          restart.handler()
          setSpinning(true)
        }}
      />
      <IconButton name="speed down" Icon={FaBackward} {...speedDown} />
      <IconButton name="step back" Icon={FaStepBackward} {...stepBack} />
      <div className="playPauseWithReverse">
        <IconButton
          name="play"
          Icon={playStatus ? FaPause : FaPlay}
          style={{
            transition: 'transform 100ms',
            transform: `rotate(${reverseStatus ? 180 : 0}deg)`
          }}
          {...play}
        />
        <IconButton name="reverse" Icon={FaSyncAlt} {...reverse} />
      </div>
      <IconButton name="step forward" Icon={FaStepForward} {...stepForward} />
      <IconButton name="speed up" Icon={FaForward} {...speedUp} />
      <div className={`extra ${extra ? 'show' : 'hide'}`}>
        <IconButton
          name="extra options"
          Icon={FaEllipsisV}
          keyCode={27}
          handler={() => setExtra(!extra)}
        />
        <div className="buttons">
          <div className="algorithms">
            <div className="sort">
              {sort.list.map(camelCase => (
                <Button
                  key={camelCase}
                  handler={() => {
                    setExtra(false)
                    sort.handler(camelCase)
                  }}
                  name={camelCase}
                  className={sort.current === camelCase ? 'active' : ''}
                >
                  {camelCase
                    .replace(/([A-Z])/g, (_x, y) => ` ${y}`)
                    .replace(/^(.)/, (_x, y) => y.toUpperCase())}
                </Button>
              ))}
            </div>
            <div className="unsort">
              {unsort.list.map(camelCase => (
                <Button
                  key={camelCase}
                  handler={() => {
                    setExtra(false)
                    unsort.handler(camelCase)
                  }}
                  name={camelCase}
                  className={unsort.current === camelCase ? 'active' : ''}
                >
                  {camelCase
                    .replace(/([A-Z])/g, (_x, y) => ` ${y}`)
                    .replace(/^(.)/, (_x, y) => y.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
          <IconButton name="size up" Icon={FaPlus} {...sizeUp} />
          <IconButton name="size down" Icon={FaMinus} {...sizeDown} />
        </div>
      </div>
    </div>
  )
}

export default Menu
