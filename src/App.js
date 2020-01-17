import React, { useState } from 'react'
import './App.scss'
import Visualiser from './components/algorithm-visualiser'

export default function App () {
  const [animate, setAnimate] = useState(false)

  return (
    <div className='App' onClick={() => setAnimate(!animate)}>
      <Visualiser
        animate={animate}
        speed={200}
      />
    </div>
  )
}
