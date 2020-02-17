import Picker from '../components/Picker'
import {
  selectSubreddit, fetchPostsIfNeeded
} from '../store/actions'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return { value: state.selectedSubreddit }
}

const mapDispatchToProps = dispatch => {
  return {
    onChange: subreddit => {
      dispatch(selectSubreddit(subreddit))
      dispatch(fetchPostsIfNeeded(subreddit))
    }
  }
}

const SubredditPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(Picker)

export default SubredditPicker
