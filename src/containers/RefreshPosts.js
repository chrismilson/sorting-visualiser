import { connect } from 'react-redux'
import Refresh from '../components/Refresh'
import { fetchPostsIfNeeded } from '../store/actions'

const mapStateToProps = state => {
  return state.postsBySubreddit[state.selectedSubreddit]
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleRefresh: () => {
      dispatch(fetchPostsIfNeeded())
    }
  }
}

const RefreshPosts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Refresh)

export default RefreshPosts
