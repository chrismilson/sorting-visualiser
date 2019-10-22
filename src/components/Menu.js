import React, { useState } from 'react'
import Slider from '@material-ui/core/Slider'

function Option (props) {
  return (
    <div
      className={[
        'item',
        props.active || (props.current && props.current === props.name)
          ? 'active'
          : 'inactive'
      ].join(' ')}
      onClick={props.action}
    >
      {props.name || props.title}
    </div>
  )
}

function SubTitle (props) {
  return (
    <div
      className={[
        'item',
        props.name.toLowerCase(),
        props.open === props.name ? 'active' : 'inactive'
      ].join(' ')}
      onMouseOver={() => props.setOpen(props.name)}
    >
      {props.name}
    </div>
  )
}

function SubMenu (props) {
  return (
    <div
      className={[
        'col',
        props.name.toLowerCase(),
        props.open === props.name ? 'visible' : 'invisible'
      ].join(' ')}
    >
      {
        props.type === 'multi' &&
        props.options
      }
      {
        props.type === 'slider' &&
        <Slider
          orientation='vertical'
          value={props.value}
          onChange={props.onChange}
        />
      }
    </div>
  )
}

function Menu (props) {
  var [open, setOpen] = useState('none')

  var subMenus = [
    {
      name: 'Algorithms',
      type: 'multi',
      options: props.algorithms.map((a, idx) => (
        <Option
          key={idx}
          {...a}
          action={() => props.setSort(a)}
          current={props.currentAlgorithm}
        />
      ))
    },
    {
      name: 'Speed',
      type: 'slider',
      onChange: props.setSpeed
    },
    {
      name: 'Size',
      type: 'slider',
      onChange: props.setLength
    }
  ]

  return (
    <div className={'Menu'} onMouseLeave={() => setOpen('none')}>
      <div className='col'>
        {
          props.options &&
          props.options.map((option, idx) => (
            <Option key={idx} {...option} />
          ))
        }
        {
          subMenus.map((m, idx) => (
            <SubTitle
              key={idx}
              {...m}
              open={open}
              setOpen={setOpen}
            />
          ))
        }
      </div>
      {
        subMenus.map((m, idx) => (
          <SubMenu
            key={idx}
            {...m}
            open={open}
          />
        ))
      }
    </div>
  )
}

export default Menu
