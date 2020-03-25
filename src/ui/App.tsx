import React from 'react'
import Display from './Display'
import './App.css'

const App: React.FC = () => {
  const values = [0, 0.5, 1]

  return (
    <div className="App">
      <div className="Menu"></div>
      <Display values={values} />
    </div>
  )
}

export default App
