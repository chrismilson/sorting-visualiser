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
  FaCode,
  FaPlus,
  FaMinus,
  FaPause
} from 'react-icons/fa'
import Button from './Button'
import './Menu.scss'

interface ButtonProps {
  handler: () => void
  keyStr?: string
  keyCode?: number
  disabled?: boolean
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
}> = ({
  reverse,
  restart,
  speedDown,
  stepBack,
  play,
  stepForward,
  speedUp,
  sizeUp,
  sizeDown
}) => {
  const [extra, setExtra] = useState(false)
  const [spinning, setSpinning] = useState(false)

  return (
    <div className="Menu">
      <Button
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
      <Button name="speed down" Icon={FaBackward} {...speedDown} />
      <Button name="step back" Icon={FaStepBackward} {...stepBack} />
      <div className="playPauseWithReverse">
        <Button
          name="play"
          Icon={play.status ? FaPause : FaPlay}
          style={{
            transition: 'transform 100ms',
            transform: `rotate(${reverse.status ? 180 : 0}deg)`
          }}
          {...play}
        />
        <Button name="reverse" Icon={FaSyncAlt} {...reverse} />
      </div>
      <Button name="step forward" Icon={FaStepForward} {...stepForward} />
      <Button name="speed up" Icon={FaForward} {...speedUp} />
      <div className={`extra ${extra ? 'show' : 'hide'}`}>
        <Button
          name="extra options"
          Icon={FaEllipsisV}
          handler={() => setExtra(!extra)}
        />
        <div className="buttons">
          <Button name="size up" Icon={FaPlus} {...sizeUp} />
          <Button name="size down" Icon={FaMinus} {...sizeDown} />
          <Button
            name="algorithm"
            Icon={FaCode}
            handler={() =>
              console.warn('Choosing an algorithm is not implemented yet.')
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Menu
