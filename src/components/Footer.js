import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../state/actions'

/**
 * The footer displays the visibility filter in use and offers options to change
 * it.
 *
 * @param {Object} props
 */
export default function Footer (props) {
  return (
    <p>
      Show:
      <FilterLink filter={VisibilityFilters.SHOW_ALL}>
        All
      </FilterLink>,
      <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
        Active
      </FilterLink>,
      <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
        Completed
      </FilterLink>
    </p>
  )
}
