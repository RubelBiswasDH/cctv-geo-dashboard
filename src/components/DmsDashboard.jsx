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
import AttendanceList from './AttendanceList'
import EmployeeList from './EmployeeList'
import FilterEmployee from './FilterEmployee'
import SubNav from './SubNav'
import Announcements from './Announcements'
import AdminPanel from './AdminPanel'
import Profile from './Profile'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Button from '@mui/material/Button';

// Import Actions & Methods
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'
import { getAnnouncements } from '../redux/actions/announcementsActions'
import { setErrorAnalytics } from '../redux/reducers/analyticsReducer'
import { getEmployee }  from '../redux/actions/employeeActions'
import { setToastIsOpen } from '../redux/reducers/dashboardReducer'

// import { activateSocket, deactivateSocket } from '../redux/actions/socketActions'
import { activateSocket_A, deactivateSocket } from '../redux/actions/socketActions'

class DmsDashboard extends React.PureComponent {
  state = {
    start_date: null,
    end_date: null,
    dateValues: [],
  }
  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    dispatch(getAnnouncements({start_date: `${start_date}`, end_date: `${end_date}`}))
    this.setState({ start_date, end_date })

    // Load Tasks
    //dispatch( loadTasks({start_date: `${start_date} 00:00:00`, end_date: `${end_date} 23:59:59`}) )

    // Activate Socket
    dispatch( activateSocket_A() )
    dispatch( getEmployee() )
    // Get Query Categories
    // dispatch( getQueryCategories() )

    // Load SND List
    // loadSndList()
    //   .then(_sndList => {
    //       const sndList = _sndList.map(s => ({
    //           value: s.snd_name,
    //           label: s.snd_name,
    //           snd: s
    //       }))

    //       dispatch( setSndList(sndList) )
    //   })
    //   .catch(err => {
    //       //console.error(err)
    //       dispatch( setSndList([]) )
    //   })
  }

  componentWillUnmount() {
    const { dispatch } = this.props

    // Deactivate Socket
    dispatch( deactivateSocket() )
  }
  //handleToastClose

  _handleToastClose = () => {
    const { dispatch } = this.props
    dispatch( setToastIsOpen(false) )
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
    dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
  }
  // Handle Report Download
  _handleReportDownload = () => {
    //  console.log('report will be downloaded..')
    const { start_date, end_date } = this.state
    const { dispatch } = this.props
    dispatch( getAttendanceReport({start_date: `${start_date}`, end_date: `${end_date}`}))
   }

  // On Feedback Close
  _onFeedbackClose = () => {
    const { dispatch } = this.props
    dispatch( setErrorAnalytics(null) )
  }

  render() {
    const { start_date, end_date } = this.state
    const { isTaskThreadOpen, isTaskLoading, user, feedback, toastIsOpen, toastMessage, toastSeverity } = this.props
    return (
      <Box sx={ containerStyles }>
        <NavBar />
        <SubNav/>
        <FilterEmployee/>
        <Box
          sx={ theme => ({
            padding: {
              xs: `${ theme.spacing(2) }`,
              md: theme.spacing(4)
            },
            width: '100%'
          })}
        >
          <Grid container={ true } spacing={4} rowSpacing={2}  sx={{border: 'none',boxSizing:'border-box',pl:0}}>

            <Grid item={ true } xs={ 12 } flexDirection={ 'row' }>
              <Box sx={{display: 'flex', justifyContent: 'space-between' }}>
              {
                (this.props.currentView === 'attendance') &&
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
                  <Button
                    onClick={ this._handleReportDownload } 
                    variant="contained" 
                    endIcon={<FileDownloadOutlinedIcon />}>
                    {"Download Report"}
                  </Button>
                </Stack>
              }

              </Box>                                        
              {/* <TaskTypeFilter /> */}
            </Grid>

            <Grid
              item={ true }
              xs={ 12 }

              // md={ isTaskThreadOpen ? 8 : 12 }
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                // border:'1px solid red'
              }}
            > 
              {
              (this.props.currentView === 'admin') && <AdminPanel />
              }
              {
                (this.props.currentView === 'attendance') && <AttendanceList />
              }
              {
                (this.props.currentView === 'announcements') && <Announcements />
              }
               {
              (this.props.currentView === 'profile') && <Profile />
              }
              {
                (this.props.currentView !== 'attendance' && this.props.currentView !== 'announcements' && this.props.currentView !== 'admin' && this.props.currentView !== 'profile') && <EmployeeList />
              }
            </Grid>
          </Grid>
        </Box>

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
        <Snackbar 
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          open={toastIsOpen} autoHideDuration={6000} onClose={this._handleToastClose}>
          <Alert onClose={this._handleToastClose} severity={ toastSeverity } sx={{ width: '100%' }}>
            {toastMessage}
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
  feedback: state.analytics.errorAnalytics,
  currentView: state?.dashboard?.currentView,
  toastIsOpen: state?.dashboard?.toastIsOpen,
  toastMessage: state?.dashboard?.toastMessage,
  toastSeverity: state?.dashboard?.toastSeverity
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(DmsDashboard)