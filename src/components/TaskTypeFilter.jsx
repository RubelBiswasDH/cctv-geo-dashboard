import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box } from '@mui/material'
import StyledButtonGroup from './common/StyledButtonGroup'

// Import Actions & Methods
import { setSelectedStatusType } from '../redux/reducers/taskReducer'

class TaskTypeFilter extends React.PureComponent {
  // On Status Type Change
  _onChange = (e, value) => {
    const { dispatch } = this.props

    // Dispatch Selected Status Type To `task` Reducer
    dispatch( setSelectedStatusType(value) )
  }

  render() {
    const { selectedStatus } = this.props

    return (
      <Box>
        <StyledButtonGroup
          data={[
            { id: -1, label: 'All', value: 'ALL' },
            { id: 1, label: 'Open - CMS', value: 'OPEN' },            
            { id: 2, label: 'Dispatched - DMS', value: 'DISPATCHED' },
            { id: 3, label: 'Assigned - S&D', value: 'ASSIGNED' },
            { id: 4, label: 'Ongoing - Gang', value: 'ONGOING' },
            { id: 5, label: 'Task Closed - Gang', value: 'PRECOMPLETION' },
            { id: 6, label: 'Resolved - S&D', value: 'RESOLVED' },
            { id: 8, label: 'Closed - DMS', value: 'CLOSED' },
            { id: 1, label: 'Cancelled - DMS', value: 'CANCELLED' },
          ]}
          value={ selectedStatus }
          onChange={ this._onChange }
        />
      </Box>
    )
  }
}

// Prop Types
TaskTypeFilter.propTypes = {
  selectedStatus: PropTypes.string,
  dispatch: PropTypes.func
}

TaskTypeFilter.defaultProps = {
  selectedStatus: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  selectedStatus: state.task.selectedStatus
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(TaskTypeFilter)