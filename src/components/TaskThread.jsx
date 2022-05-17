import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

// Import Components
import { Box, AppBar, Paper, Typography, Stack, Tooltip, IconButton } from '@mui/material'
import { ChevronRight } from '@mui/icons-material'

// Import Actions & Methods
import { setIsTaskThreadOpen } from '../redux/reducers/taskReducer'
// import { loadInitialThreadMessages } from '../redux/actions/taskActions'
import {getAnnouncements}  from '../redux/actions/announcementsActions'

class TaskThread extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props

    const today = dayjs().format('YYYY-MM-DD')
    console.log("Annoucement loading.. ")
    dispatch(getAnnouncements())

    // dispatch(
    //   loadInitialThreadMessages(today + ' 00:00:00', today + ' 23:59:59')
    // )

  }

  // Sort Messages by Emergency
  _sortByEmergency = messages => {
    if(!messages) {
      return []
    }

    return [ ...messages ].sort((m1, m2) => {
      const m1Em = m1?.task?.is_emergency ?? 0
      const m2Em = m2?.task?.is_emergency ?? 0

      return m2Em - m1Em
    })
  }

  _closeTaskThread = () => {
    const { dispatch } = this.props
    dispatch( setIsTaskThreadOpen(false) )
  }

  render() {
    const { messages,announcements } = this.props
    const sortedMessages = this._sortByEmergency(messages)
    // console.log({ announcements })
    return (
      <Box sx={ containerStyles }>
        <Paper variant='outlined' sx={ paperStyles }>
          <AppBar
            position='sticky'
            sx={ theme => ({
     
              padding: theme.spacing(1),
              // background: theme.palette.gray[200],
              background: '#FF6961',
              boxShadow: theme.shadows[2],
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',              
            })}
          >
            <Tooltip title='Collapse'>
              <IconButton
                onClick={ this._closeTaskThread }
                sx={{ padding: 0 }}
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>

            <Typography
              variant='h6'
              align='center'
              sx={ theme => ({
                width: '100%',
                color: theme.palette.text.white,
                fontSize: '14px',
                fontWeight: 600,
                pt:.25,
              }) }
            >
              { 'Announcements' }
            </Typography>
          </AppBar>

          <Box width='100%' sx={{ height: '100%', overflow: 'auto' }}>
            <Stack
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'flex-end',
                // marginBottom:'30px',
                overflow:'auto'
              }}
            >
              { announcements && announcements.map((a, i) => (
                  <Box
                    key={ i }
                    sx={theme => ({
                      padding: '8px',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: '#ffffff'
                      // background: m?.task?.is_emergency ?
                      //   'rgba(211, 47, 47, 0.2)'
                      //   :
                      //   i % 2 ?
                      //   theme.palette.grey[200]
                      //   :
                      //   '#ffffff'
                    })}
                  >
                    <Box sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      pb:.5
                    }}>
                      <Typography
                        variant='body2'
                        sx={{ fontSize: '15px', fontWeight:'600', color:'#000080	', marginRight:0,p:0,m:0 }}
                      >
                        { a.name ? a.name+" : ": '' }
                      </Typography>
                      <Typography
                      variant='body2'
                      fontSize='10px'
                      color='#808080'
                      marginLeft='auto'
                      sx={{ marginLeft: 'auto',p:0,pt:.5,m:0 }}
                    >
                      { a.created_at ? a.created_at : '' }
                    </Typography>
                     
                    </Box>
                    <Box sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Typography
                          variant='body2'
                          sx={{ fontSize: '12px' }}
                        >
                          { a.description ? a.description: '' }
                      </Typography>
                    </Box>
                    
                   
                  </Box>
                ))
              }
            </Stack>
          </Box>
        </Paper>
      </Box>
    )
  }
}

// Styles
const containerStyles = {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '84vh'
}

const paperStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  // overflow: 'auto'
}

// Prop Types
TaskThread.propTypes = {
  messages: PropTypes.array
}

TaskThread.defaultProps = {
  messages: []
}

const mapStateToProps = state => ({
  messages: state.task.threadMessages,
  announcements: state.announcements.announcements
})

export default connect(mapStateToProps)(TaskThread)