import React, { useState } from 'react'
import Slider from '@material-ui/core/Slider'

function Menu (props) {
  var [algs, setAlgs] = useState(false)
  var [speed, setSpeed] = useState(false)

  const setOpen = (name) => {
    switch (name.toLowerCase()) {
      case 'algs':
        setSpeed(false)
        setAlgs(true)
        break
      case 'speed':
        setSpeed(true)
        setAlgs(false)
        break
      default:
        setAlgs(false)
        setSpeed(false)
    }
  }

  return (
    <div className={'Menu'} onMouseLeave={() => setOpen('none')}>
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
          className={[
            'item',
            'algorithms',
            algs ? 'active' : 'inactive'
          ].join(' ')}
          onMouseOver={() => setOpen('algs')}
        >
          Algorithm
        </div>
        <div
          className={[
            'item',
            'speed',
            speed ? 'active' : 'inactive'
          ].join(' ')}
          onMouseOver={() => setOpen('speed')}
        >
          Speed
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
      <div
        className={[
          'col',
          'speed',
          speed ? 'visible' : 'invisible'
        ].join(' ')}
      >
        <Slider
          orientation='vertical'
          value={props.speed}
          onChange={props.setSpeed}
        />
      </div>
    </div>
  )
}

export default Menu
