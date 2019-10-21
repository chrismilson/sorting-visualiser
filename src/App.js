import React from 'react'
import './App.scss'

import Array from './components/Array'
import {
  // MergeSort,
  BubbleSort
} from './Algorithms'

class App extends React.Component {
  constructor (props) {
    super(props)

    var nums = []
    for (var i = 0; i < 1000; i++) {
      nums.push(Math.random())
    }

    this.state = {
      // mergeSort: new MergeSort(nums),
      rate: 5,
      nums: [...nums],
      orig: nums
    }

    this.sort = BubbleSort([...nums])

    this.step = this.step.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.reset = this.reset.bind(this)
  }

  reset () {
    this.setState({ check: -1, compare: -1, nums: [...this.state.orig] })
    this.sort = BubbleSort([...this.state.orig])
  }

  step () {
    var finished = false
    this.setState(() => {
      var check = this.sort.next().value
      var compare = this.sort.next().value
      var nums = this.sort.next().value
      if (!nums) finished = true
      return {
        check,
        compare,
        nums: nums || this.state.nums
      }
    })
    return finished
  }

  play () {
    if (this.playing) return
    this.player = setInterval(() => {
      if (this.step()) {
        clearInterval(this.player)
        this.playing = false
      }
    }, this.state.rate)
    this.playing = true
  }

  pause () {
    clearInterval(this.player)
    this.playing = false
  }

  render () {
    return (
      <div className='App'>
        <div className='buttons'>
          <div className='button' onClick={this.play}>Play</div>
          <div className='button' onClick={this.pause}>Pause</div>
          <div className='button' onClick={this.step}>Step</div>
          <div className='button' onClick={this.reset}>Reset</div>
        </div>
        <Array {...this.state} />
      </div>
    )
  }
}

export default App
