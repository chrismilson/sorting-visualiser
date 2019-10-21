import React from 'react'

function Menu (props) {
  return (
    <div className={'Menu'}>
      {
        props.options.map((option, idx) => (
          <div
            key={idx}
            className={[
              'item',
              option.active ? 'active' : 'inactive'
            ].join(' ')}
            onClick={option.action}
          >
            {
              option.title
            }
          </div>
        ))
      }
    </div>
  )
}

export default Menu
