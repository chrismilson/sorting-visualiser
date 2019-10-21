import React from 'react'
import './App.scss'

import Array from './components/Array'
import Menu from './components/Menu'
import {
  // BubbleSort,
  MergeSortBF
} from './Algorithms'

class App extends React.Component {
  constructor (props) {
    super(props)

    var nums = []
    for (var i = 0; i < 100; i++) {
      nums.push(Math.random())
    }

    this.state = {
      // mergeSort: new MergeSort(nums),
      rate: 0,
      nums: [...nums],
      orig: nums
    }

    // this.sort = BubbleSort([...nums])
    this.sort = MergeSortBF([...nums])

    this.step = this.step.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.reset = this.reset.bind(this)
  }

  reset () {
    this.setState({ check: -1, compare: -1, nums: [...this.state.orig] })
    // this.sort = BubbleSort([...this.state.orig])
    this.sort = MergeSortBF([...this.state.orig])
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
    if (this.state.playing) return
    this.player = setInterval(() => {
      if (this.step()) {
        clearInterval(this.player)
        console.log('done')
        this.setState({ playing: false })
      }
    }, this.state.rate)
    this.setState({ playing: true })
  }

  pause () {
    clearInterval(this.player)
    this.setState({ playing: false })
  }

  render () {
    return (
      <div className='App'>
        <Menu
          options={[
            {
              title: 'Play',
              action: this.play,
              active: this.state.playing
            },
            {
              title: 'Pause',
              action: this.pause,
              active: !this.state.playing
            },
            {
              title: 'Step',
              action: this.step
            },
            {
              title: 'Reset',
              action: this.reset
            }
          ]}
        />
        <Array {...this.state} />
      </div>
    )
  }
}

export default App
