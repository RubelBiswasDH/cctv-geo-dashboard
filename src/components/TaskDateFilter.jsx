import React from 'react'
import PropsTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

// Import Components
import StyledStepperDate from './common/StyledStepperDate'

// Import Actions & Methods
import { setSelectedDate } from '../redux/reducers/taskReducer'

class TaskDateFilter extends React.PureComponent {
  // On Date Change
  _onChange = date => {
    const { dispatch } = this.props
    const selectedDate = dayjs(date).format('YYYY-MM-DD')
    dispatch( setSelectedDate(selectedDate) )
  }

  render() {
    const { selectedDate } = this.props

    return (
      <StyledStepperDate
        onChange={ this._onChange }
        date={ selectedDate }
      />
    )
  }
}

// Prop Types
TaskDateFilter.propTypes = {
  selectedDate: PropsTypes.string,
  dispatch: PropsTypes.func
}

TaskDateFilter.defaultProps = {
  selectedDate: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  selectedDate: state.task.selectedDate
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(TaskDateFilter)