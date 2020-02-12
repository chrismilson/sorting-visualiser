import React from 'react'
import AddTodo from './containers/AddTodo'
import Footer from './components/Footer'
import VisibleTodoList from './containers/VisibleTodoList'
import './App.scss'

export default function App () {
  return (
    <div className='App'>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}
