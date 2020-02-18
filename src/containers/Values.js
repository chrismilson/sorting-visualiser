import { connect } from 'react-redux'
import Display from '../components/Display'

const mapStateToProps = state => {
  return {
    values: state.currentValues,
    move: state.moves[state.currentMove]
  }
}

const Values = connect(
  mapStateToProps
)(Display)

export default Values
