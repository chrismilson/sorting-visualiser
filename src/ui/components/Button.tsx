import React, { useRef, useEffect } from 'react'
import { IconType } from 'react-icons/lib/cjs'
import './Button.scss'

const Button: React.FC<{
  name: string
  handler: () => void
  Icon: IconType
  disabled?: boolean
  key?: string
  keyCode?: number
}> = ({ name, handler, Icon, disabled = false, key, keyCode }) => {
  const camelCaseName = name
    .replace(/^(.)/, (_x, y) => y.toLowerCase())
    .replace(/ (.)/, (_x, y) => y.toUpperCase())

  // We want to make it possible to specify a keyboard event that will also fire
  // the button.
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (key !== undefined || keyCode !== undefined) {
      const listener = (e: KeyboardEvent) => {
        if (e.key === key || e.keyCode === keyCode) ref.current?.click()
      }
      window.addEventListener('keydown', listener)
      return () => {
        window.removeEventListener('keydown', listener)
      }
    }
  }, [ref, key, keyCode])

  return (
    <button
      ref={ref}
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
