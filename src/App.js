import React from 'react'
import './App.scss'

import Array from './components/Array'

class App extends React.Component {
  constructor (props) {
    super(props)

    var nums = []
    for (var i = 0; i < 100; i++) {
      nums.push(Math.random())
    }

    this.state = {
      nums: nums
    }
  }

  render () {
    return (
      <div className='App'>
        <div className='button' onClick={this.sort}>Sort</div>
        <Array nums={this.state.nums} />
      </div>
    )
  }
}

export default App
