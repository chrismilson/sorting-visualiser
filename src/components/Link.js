import React from 'react'

/**
 * Displays a kind of toggle button. When it is active, it will not be
 * activatable, but if it is not active then it can be clicked (most likely
 * dispatching an action that will cause it to become active)
 *
 * @param {Object} props
 * @param {boolean} props.active
 * @param {*} props.children
 * @param {Function} props.onClick
 */
export default function Link (props) {
  const { active, children, onClick } = props

  return active
    ? <span>{ children }</span>
    : (
      <a
        href=''
        onClick={e => {
          e.preventDefault()
          onClick()
        }}
      >{ children }</a>
    )
}
