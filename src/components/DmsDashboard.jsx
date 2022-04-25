import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

// Import Components
import { Box, Grid, Tooltip, IconButton, Stack, TextField, Snackbar, Alert } from '@mui/material'
import { ChevronLeft, ArrowRightAlt } from '@mui/icons-material'
import { DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import NavBar from './NavBar'
// import TaskDateFilter from './TaskDateFilter'
import TaskTypeFilter from './TaskTypeFilter'
import TaskList from './TaskList'
import TaskThread from './TaskThread'
import AnalyticsDialog from './AnalyticsDialog'

// Import Actions & Methods
import { setSndList, setIsTaskThreadOpen } from '../redux/reducers/taskReducer'
import { loadSndList, loadTasks, getQueryCategories } from '../redux/actions/taskActions'
import { activateSocket, deactivateSocket } from '../redux/actions/socketActions'
import { setErrorAnalytics } from '../redux/reducers/analyticsReducer'

class DmsDashboard extends React.PureComponent {
  state = {
    start_date: null,
    end_date: null,
    dateValues: [],
    isAnalyticsDialogOpen: false
  }
  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')

    this.setState({ start_date, end_date })

    // Load Tasks
    dispatch( loadTasks({start_date: `${start_date} 00:00:00`, end_date: `${end_date} 23:59:59`}) )

    // Activate Socket
    dispatch( activateSocket() )

    // Get Query Categories
    dispatch( getQueryCategories() )

    // Load SND List
    loadSndList()
      .then(_sndList => {
          const sndList = _sndList.map(s => ({
              value: s.snd_name,
              label: s.snd_name,
              snd: s
          }))

          dispatch( setSndList(sndList) )
      })
      .catch(err => {
          console.error(err)
          dispatch( setSndList([]) )
      })
  }

  componentWillUnmount() {
    const { dispatch } = this.props

    // Deactivate Socket
    dispatch( deactivateSocket() )
  }

  // Open task thread
  _openTaskThread = () => {
    const { dispatch } = this.props
    dispatch( setIsTaskThreadOpen(true) )
  }

  // Handle Date Range Change
  _handleDateRangeChange = dateValues => {
    const { start_date, end_date } = this.state            

    // Get start date and end date from date range picker
    const startDate = dateValues[0]?.$d && dayjs(new Date(dateValues[0]?.$d)).format('YYYY-MM-DD')
    const endDate = dateValues[1]?.$d && dayjs(new Date(dateValues[1]?.$d)).format('YYYY-MM-DD')

    // Set state for start date and end date accordingly
    this.setState({ dateValues, start_date: startDate ?? start_date, end_date: endDate ?? end_date })
  }

  // Handle Get Data
  _handleOnSubmit = () => {
    const { start_date, end_date } = this.state
    const { dispatch } = this.props

    // Load Tasks
    dispatch( loadTasks({start_date: `${start_date} 00:00:00`, end_date: `${end_date} 23:59:59`}) )
  }

  // Handle Analytics Dialog
  _handleAnalyticsDialog = () => {
    this.setState({ isAnalyticsDialogOpen: true })
  }

   // Close Task Timeline Dialog
   _closeAnalyticsDialog = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return

    } else {
      this.setState({ isAnalyticsDialogOpen: false })
    }
  }

  // On Feedback Close
  _onFeedbackClose = () => {
    const { dispatch } = this.props
    dispatch( setErrorAnalytics(null) )
  }

  render() {
    const { start_date, end_date, isAnalyticsDialogOpen } = this.state
    const { isTaskThreadOpen, isTaskLoading, user, feedback } = this.props
    return (
      <Box sx={ containerStyles }>
        <NavBar />

        <Box
          sx={ theme => ({
            padding: {
              xs: `${ theme.spacing(2) }`,
              md: theme.spacing(4)
            },
            width: '100%'
          })}
        >
          <Grid container={ true } spacing={ 4 }>
            <Grid item={ true } xs={ 12 } flexDirection={ 'row' }>
              <Box sx={{ pb: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Stack spacing={ 1 } direction='row'>
                  <LocalizationProvider dateAdapter={ AdapterDayjs }>
                      <DateRangePicker
                          value={ [ start_date, end_date ] }
                          onChange={ this._handleDateRangeChange }
                          disableMaskedInput={ true }
                          inputFormat={ 'DD-MMM-YYYY' }
                          renderInput={(startProps, endProps) => (                                            
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <TextField {...startProps} size={ 'small' } fullWidth={ true } />
                                      <ArrowRightAlt />
                                      <TextField {...endProps} size={ 'small' } fullWidth={ true } />
                                  </Box>                                            
                              
                          )}
                          PopperProps={{
                            placement: 'bottom-start',
                          }}
                          onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
                      />
                  </LocalizationProvider>
                  <LoadingButton 
                      loading={ isTaskLoading }
                      variant={ 'contained' }
                      onClick={ this._handleOnSubmit }
                      size={ 'small' }
                      disableTouchRipple={ true }                      
                  >
                      { 'Get Data' }
                  </LoadingButton>
                </Stack>
                {
                  user.user_type === 'SUPERVISOR' &&
                  <LoadingButton 
                    loading={ false }
                    variant={ 'contained' }
                    onClick={ this._handleAnalyticsDialog }
                    size={ 'small' }
                    disableTouchRipple={ true }                      
                  >
                      { 'Analytics' }
                  </LoadingButton>
                }                
              </Box>                                        
              <TaskTypeFilter />
            </Grid>

            <Grid
              item={ true }
              xs={ 12 }
              md={ isTaskThreadOpen ? 8 : 12 }
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <TaskList />

              { !isTaskThreadOpen &&
                  <Tooltip title='Open Thread'>
                    <IconButton
                      onClick={ this._openTaskThread }
                      sx={{ padding: 0 }}
                    >
                      <ChevronLeft fontSize='large' />
                    </IconButton>
                  </Tooltip>
              }
            </Grid>

            <Grid
              item={ true }
              xs={ 12 }
              md={ isTaskThreadOpen ? 4 : 0 }
              sx={{
                display: isTaskThreadOpen ? 'block' : 'none'
              }}
            >
              <TaskThread />
            </Grid>
          </Grid>
        </Box>
        {
          user?.user_type === 'SUPERVISOR' && isAnalyticsDialogOpen &&
          <AnalyticsDialog 
            isDialogOpen={ isAnalyticsDialogOpen }
            handleDialogOnClose={ this._closeAnalyticsDialog }
          />
        }

        <Snackbar
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            open={ Boolean(feedback) }
            autoHideDuration={ 6000 }
            onClose={ this._onFeedbackClose }
        >
            <Alert
                severity={ feedback?.status === 200 ? 'success' : 'error' }
                onClose={ this._onFeedbackClose }
                sx={{ width: '100%' }}
            >
                { feedback?.message ? feedback.message : 'Something went wrong!' }
            </Alert>
        </Snackbar>
      </Box>
    )
  }
}

// Styles
const containerStyles = {
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center'
}

// Prop Types
DmsDashboard.propTypes = {
  isTaskThreadOpen: PropTypes.bool,
  dispatch: PropTypes.func
}

DmsDashboard.defaultProps = {
  isTaskThreadOpen: true,
  dispatch: () => null
}

const mapStateToProps = state => ({
  isTaskThreadOpen: state.task.isTaskThreadOpen,
  isTaskLoading: state.task.isTaskLoading,
  queryCategory: state.task.queryCategory,
  user: state.auth.user,
  feedback: state.analytics.errorAnalytics
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(DmsDashboard)