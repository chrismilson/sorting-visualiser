import React from 'react'
import Todo from './Todo'

/**
 * A presentational component that displays a list of todos.
 *
 * @param {Object} props
 * @param {Object[]} props.todos
 * @param {Function} props.onTodoClick
 */
export default function TodoList (props) {
  const { todos, onTodoClick } = props

  return (
    <ul>
      {
        todos.map((todo, idx) => (
          <Todo
            key={idx}
            {...todo}
            onClick={() => onTodoClick(idx)}
          />
        ))
      }
    </ul>
  )
}
