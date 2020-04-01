import React, { useRef, useEffect } from 'react'
import { IconType } from 'react-icons/lib/cjs'
import './Button.scss'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string
  handler: () => void
  disabled?: boolean
  keyStr?: string
  keyCode?: number
}

const Button: React.FC<ButtonProps> = ({
  name,
  handler,
  disabled,
  keyStr,
  keyCode,
  children,
  className,
  ...buttonAttributes
}) => {
  const camelCaseName = name
    .replace(/^(.)/, (_x, y) => y.toLowerCase())
    .replace(/ (.)/g, (_x, y) => y.toUpperCase())

  // We want to make it possible to specify a keyboard event that will also fire
  // the button.
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (keyStr !== undefined || keyCode !== undefined) {
      const listener = (e: KeyboardEvent) => {
        // By clicking the button instead of calling the callback, we make sure
        // that the callback is not fired if the button is disabled
        if (e.key === keyStr || e.keyCode === keyCode) {
          ref.current?.click()
          if (e.key === ' ') e.preventDefault()
        }
      }
      window.addEventListener('keydown', listener)
      return () => {
        window.removeEventListener('keydown', listener)
      }
    }
  }, [ref, keyStr, keyCode])

  return (
    <button
      ref={ref}
      className={`Button ${className} ${camelCaseName}`}
      title={name}
      onClick={handler}
      disabled={disabled}
      {...buttonAttributes}
    >
      {children}
    </button>
  )
}

export const IconButton: React.FC<ButtonProps & { Icon: IconType }> = ({
  Icon,
  ...props
}) => (
  <Button {...props} className={`${props.className} Icon`}>
    <Icon className="icon" />
  </Button>
)

export default Button
