import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Box, Typography } from '@mui/material'
import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab'

class TaskTimeline extends React.PureComponent {
  render() {
    const { data } = this.props

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        { data && data.length > 0 ?
          (
            <Timeline sx={{ marginBottom: 0 }}>
              { data.map((d, i) =>
                  <TimelineItem key={ i }>
                    <TimelineOppositeContent
                      color='text.secondary'
                      sx={{ maxWidth: '320px', whiteSpace: 'wrap' }}
                    >
                      { d.time }
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                      { i < data.length-1 &&
                        <TimelineConnector />
                      }
                    </TimelineSeparator>
                    <TimelineContent sx={{ maxWidth: '320px', whiteSpace: 'wrap' }}>
                      { d.message }
                    </TimelineContent>
                  </TimelineItem>
                )
              }
            </Timeline>
          )
          :
          (
            <Typography>{ 'No data found.' }</Typography>
          )
        }
      </Box>
    )
  }
}

// Prop Types
TaskTimeline.propTypes = {
  data: PropTypes.array
}

TaskTimeline.defaultProps = {
  data: []
}

export default TaskTimeline