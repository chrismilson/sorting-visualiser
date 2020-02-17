import React from 'react'

export default function List (props) {
  const { isFetching, items = [] } = props

  if (items.length === 0) {
    if (isFetching) return <h2>Loading...</h2>
    return <h2>Empty.</h2>
  }
  return (
    <ul>
      {
        this.items.map(item => <li key={item}>{item}</li>)
      }
    </ul>
  )
}
