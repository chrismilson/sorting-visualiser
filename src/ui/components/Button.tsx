import React from 'react'
import { IconType } from 'react-icons/lib/cjs'
import './Button.scss'

const Button: React.FC<{
  name: string
  handler: () => void
  Icon: IconType
  disabled?: boolean
}> = ({ name, handler, Icon, disabled = false }) => {
  const camelCaseName = name
    .replace(/^(.)/, (_x, y) => y.toLowerCase())
    .replace(/ (.)/, (_x, y) => y.toUpperCase())
  return (
    <button
      className={`Button ${camelCaseName}`}
      title={name}
      onClick={handler}
      disabled={disabled}
    >
      <Icon />
    </button>
  )
}

export default Button
