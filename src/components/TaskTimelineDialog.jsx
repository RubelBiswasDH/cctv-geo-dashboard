import React from 'react'
import PropTypes from 'prop-types'

// Impot Components
import { Box, CircularProgress } from '@mui/material'
import StyledDialog from './common/StyledDialog'
import TaskTimeline from './TaskTimeline'

class TaskTimelineDialog extends React.PureComponent {
  render() {
    const { isDialogOpen, handleDialogOnClose, timelineData, loading } = this.props

    return (
      <StyledDialog
        isDialogOpen={ isDialogOpen }
        title='Ticket Timeline'
        handleDialogOnClose={ handleDialogOnClose }
      >
        <Box sx={ contentBodyStyles }>
          { loading ?
            (
              <CircularProgress />
            )
            :
            (
              <TaskTimeline
                data={ timelineData }
              />
            )
          }
        </Box>
      </StyledDialog>
    )
  }
}

// Styles
const contentBodyStyles = {
  width: '100%',
  minHeight: '120px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

// PropTypes
TaskTimelineDialog.propTypes = {    
  handleDialogOnClose: PropTypes.func,
  isDialogOpen: PropTypes.bool,
  timelineData: PropTypes.array,
  loading: PropTypes.bool
}

TaskTimelineDialog.defaultProps = {
  handleDialogOnClose: () => null,
  isDialogOpen: false,
  timelineData: [],
  loading: false
}

export default TaskTimelineDialog