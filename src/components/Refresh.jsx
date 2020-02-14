import React from 'react'

export default function Refresh (props) {
  const { lastUpdated, isFetching, handleRefresh } = props

  return <>
    {
      lastUpdated && (
        <span>
          Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
        </span>
      )
    }
    { !isFetching && <button onClick={handleRefresh}>Refresh</button> }
  </>
}
