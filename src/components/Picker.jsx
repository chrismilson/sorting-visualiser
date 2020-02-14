import React from 'react'

export default function Picker (props) {
  const { value, onChange, options } = props
  return (
    <span>
      <h1>{ value }</h1>
      <select onChange={e => onChange(e.target.value)}>
        {
          options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))
        }
      </select>
    </span>
  )
}
