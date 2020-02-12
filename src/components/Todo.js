import React from 'react'

/**
 * A simple presentational component to display a todo item.
 *
 * @param {Object} props
 * @param {Function} props.onClick
 * @param {string} props.text
 * @param {boolean} props.completed
 */
export default function Todo (props) {
  const { onClick, completed, text } = props
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}
    >
      { text }
    </li>
  )
}
