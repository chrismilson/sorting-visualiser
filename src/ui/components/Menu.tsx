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
  reverse: ButtonProps & { status: boolean }
  restart: ButtonProps
  speedDown: ButtonProps
  play: ButtonProps & { status: boolean }
  speedUp: ButtonProps
  sizeUp: ButtonProps
  sizeDown: ButtonProps
}> = ({ reverse, restart, speedDown, play, speedUp, sizeUp, sizeDown }) => {
  const [extra, setExtra] = useState(false)

  return (
    <div className="Menu">
      <Button name="restart" Icon={FaStepBackward} keyStr="r" {...restart} />
      <Button name="speedDown" Icon={FaBackward} keyCode={37} {...speedDown} />
      <div className="playPauseWithReverse">
        <Button
          name="play"
          Icon={play.status ? FaPause : FaPlay}
          keyStr=" "
          style={{
            transition: 'transform 100ms',
            transform: `rotate(${reverse.status ? 180 : 0}deg)`
          }}
          {...play}
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
          <Button name="Size Up" Icon={FaPlus} keyCode={38} {...sizeUp} />
          <Button name="Size Down" Icon={FaMinus} keyCode={40} {...sizeDown} />
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
