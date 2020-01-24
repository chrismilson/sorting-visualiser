import React from 'react'
import ReactDOM from 'react-dom'
import Visualiser from './Visualiser'

ReactDOM.render(<Visualiser />, document.getElementById('root'))

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister()
  })
}
