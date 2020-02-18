import { connect } from 'react-redux'
import Display from '../components/Display'

const mapStateToProps = state => {
  return {
    values: state.values
  }
}

const Values = connect(
  mapStateToProps
)(Display)

export default Values
