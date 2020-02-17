import List from '../components/List'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  const posts = state.postsBySubreddit[state.selectedSubreddit]
  return {
    isFetching: posts.isFetching,
    items: posts.items
  }
}

const Posts = connect(mapStateToProps)(List)

export default Posts
