import React, { useState } from 'react'
import {
  FaExchangeAlt,
  FaStepBackward,
  FaBackward,
  FaPlay,
  FaForward,
  FaEllipsisV,
  FaCode,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
import Button from './Button'
import './Menu.scss'

const Menu: React.FC<{
  reverse: { handler: () => void; disabled?: boolean }
  restart: { handler: () => void; disabled?: boolean }
  speedDown: { handler: () => void; disabled?: boolean }
  playPause: { handler: () => void; disabled?: boolean }
  speedUp: { handler: () => void; disabled?: boolean }
  sizeUp: { handler: () => void; disabled?: boolean }
  sizeDown: { handler: () => void; disabled?: boolean }
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
      <Button name="reverse" Icon={FaExchangeAlt} {...reverse} />
      <Button name="restart" Icon={FaStepBackward} {...restart} />
      <Button name="speedDown" Icon={FaBackward} {...speedDown} />
      <Button name="playPause" Icon={FaPlay} {...playPause} />
      <Button name="speedUp" Icon={FaForward} {...speedUp} />
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