import React, { useState } from 'react'

function Menu (props) {
  var [algs, setAlgs] = useState(false)

  const collapse = () => {
    setAlgs(false)
  }

  return (
    <div className={'Menu'} onMouseLeave={collapse}>
      <div className='col'>
        {
          props.options &&
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
        <div
          className='item algorithm'
          onMouseOver={() => setAlgs(true)}
        >
          Algorithm
        </div>
      </div>
      <div
        className={[
          'col',
          'algorithms',
          algs ? 'visible' : 'invisible'
        ].join(' ')}
      >
        {
          props.algorithms &&
          props.algorithms.map((alg, idx) => (
            <div
              key={idx}
              className={[
                'item',
                props.currentAlgorithm === alg.name ? 'active' : 'inactive'
              ].join(' ')}
              onClick={() => props.setSort(alg)}
            >
              {alg.name}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Menu
