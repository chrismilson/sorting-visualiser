import React from 'react'
import './App.scss'

import Array from './components/Array'
import Menu from './components/Menu'
import Algorithms from './Algorithms'

class App extends React.Component {
  constructor (props) {
    super(props)

    var n = this.newArray()
    var sort = Algorithms.MergeSortBF
    this.state = {
      speed: 80,
      check: -1,
      compare: -1,
      nums: [...n],
      orig: n,
      len: 10,
      sort: sort,
      sortInstance: sort.algorithm([...n])
    }

    this.step = this.step.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.reset = this.reset.bind(this)
    this.setSort = this.setSort.bind(this)
  }

  newArray (size = 144) {
    var nums = []
    for (var i = 0; i < size; i++) {
      nums.push(Math.random())
    }

    return nums
  }

  setSort (sort) {
    this.setState({
      sort: sort,
      sortInstance: sort.algorithm([...this.state.nums])
    })
  }

  reset () {
    this.setState({
      check: -1,
      compare: -1,
      nums: [...this.state.orig],
      sortInstance: this.state.sort.algorithm([...this.state.orig])
    })
  }

  step () {
    var finished = false
    this.setState(() => {
      var check = this.state.sortInstance.next().value
      var compare = this.state.sortInstance.next().value
      var nums = this.state.sortInstance.next().value
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
    }, Math.pow(101 - this.state.speed, 1.5))
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
          algorithms={Object.values(Algorithms)}
          setSort={this.setSort}
          speed={this.state.speed}
          setSpeed={(e, speed) => {
            e.preventDefault()
            this.setState({ speed })
            this.pause()
            this.play()
          }}
          length={this.state.len}
          setLength={(e, length) => {
            e.preventDefault()
            this.pause()
            var n = this.newArray(Math.pow(length + 2, 1.5))
            this.setState({
              check: -1,
              compare: -1,
              nums: [...n],
              orig: n,
              len: length,
              sortInstance: this.state.sort.algorithm([...n])
            })
          }}
        />
        <Array {...this.state} />
      </div>
    )
  }
}

export default App
