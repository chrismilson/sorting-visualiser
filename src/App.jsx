import React from 'react'
import SubredditPicker from './containers/SubredditPicker'
import RefreshPosts from './containers/RefreshPosts'
import './App.scss'

export default function App () {
  return (
    <div className='App'>
      <SubredditPicker options={['reactjs', 'frontend']} />
      <RefreshPosts />
    </div>
  )
}
