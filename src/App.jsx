import React from 'react'
import SubredditPicker from './containers/SubredditPicker'
import './App.scss'

export default function App () {
  return (
    <div className='App'>
      <SubredditPicker options={['reactjs', 'frontend']} />
    </div>
  )
}
