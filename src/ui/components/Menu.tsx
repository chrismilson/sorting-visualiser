import React, { useState } from 'react'
import {
  FaSyncAlt,
  FaStepBackward,
  FaBackward,
  FaPlay,
  FaForward,
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
  disabled?: boolean
}

const Menu: React.FC<{
  reverse: ButtonProps
  restart: ButtonProps
  speedDown: ButtonProps
  playPause: ButtonProps & { play: boolean }
  speedUp: ButtonProps
  sizeUp: ButtonProps
  sizeDown: ButtonProps
}> = ({
  reverse,
  restart,
  speedDown,
  playPause,
  speedUp,
  sizeUp,
  sizeDown
}) => {
  const [extra, setExtra] = useState(false)

  return (
    <div className="Menu">
      <Button name="restart" Icon={FaStepBackward} keyStr="r" {...restart} />
      <Button name="speedDown" Icon={FaBackward} keyCode={37} {...speedDown} />
      <div className="playPauseWithReverse">
        <Button
          name="playPause"
          Icon={playPause.play ? FaPause : FaPlay}
          keyStr=" "
          {...playPause}
        />
        <Button name="reverse" Icon={FaSyncAlt} keyStr="`" {...reverse} />
      </div>
      <Button name="speedUp" Icon={FaForward} keyCode={39} {...speedUp} />
      <div className={`extra ${extra ? 'show' : 'hide'}`}>
        <Button
          name="toggle"
          Icon={FaEllipsisV}
          handler={() => setExtra(!extra)}
        />
        <div className="buttons">
          <Button name="Size Up" Icon={FaPlus} {...sizeUp} />
          <Button name="Size Down" Icon={FaMinus} {...sizeDown} />
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
