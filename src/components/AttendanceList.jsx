import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { AssignmentInd, Timeline, Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'

// Import Actions & Methods
import { playNotificationSound, stopNotificationSound } from '../utils/utils'
import { getAttendance }  from '../redux/actions/attendanceActions'
import dayjs from 'dayjs'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.25, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
 ]

class AttendanceList extends React.PureComponent {
 
  state = {
    start_date:null,
    start_date: null,
    isTaskDetailsOpen: false,
    isTaskTimelineOpen: false,
    selectedTask: {},
    isTimelineLoading: false,
    feedback: null,
    uniqueDates: [],
    tableColumns: []
  }

  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    this.setState({ start_date, end_date })
    this._getUniqueDates()
    // Load Tasks
    dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
      if (this.props.attendanceList !== prevProps.attendanceList) {
        this._getUniqueDates()
      }
    }

  _getUniqueDates = () => {
      const { attendanceList } = this.props
      let dates = []
      attendanceList.forEach(data => {
        dates.push(dayjs(data.enter_time).format("DD/MM/YYYY"))
      })
      const unique = [...new Set(dates)]
      this.setState(() => ({ uniqueDates:unique }))
    }

  _generateAttendanceColumns = () => {
    const { uniqueDates } = this.state
    
    const dyanmicColumns = uniqueDates.map(
       (date) => ( { 
         field: date, headerName: date, minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false,valueGetter: ({ value }) => value || "A",

        }
    ))
    return dyanmicColumns
  }

  mappedAttendanceInfo = () => {
    const {attendanceList, announcements, employeeList } = this.props;

    const getAnnouncement = (id,date) => {
      if(announcements.length > 0){
        const announcement = announcements.filter(an => (an.user_id === id && dayjs(an?.created_at).format('YYYY-MM-DD')=== dayjs(date).format('YYYY-MM-DD')))[0]
        if (announcement && announcement?.type=="LATE"){
          return announcement?.description
        }
        
      }
      else return ''
    }

    const attendanceInfo = employeeList.map((a,i) => {
      
      let individualAttendance = {}
      
      const getIndividualAttendance = ( id ) => attendanceList.forEach( a => {
        if (a.user_id === id) {
          const enter_time = dayjs(a?.enter_time).format("DD/MM/YYYY")
          if (enter_time) {
            if(a.is_late){
              individualAttendance[enter_time] = "L"
            }
            else{
              individualAttendance[enter_time] = "P"
            }
          }
        } })

      getIndividualAttendance(a?.id)
        return ({
          "id": a?.id,
          "serial_no":i+1,
          "name": a?.name,
          ...individualAttendance
        })
    })
    return attendanceInfo
    
  }

  // Close Task Timeline Dialog
  _closeTaskTimeline = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return

    } else {
      this.setState({ isTaskTimelineOpen: false })
    }
  }

  // On Feedback Close
  _onFeedbackClose = () => {
    this.setState({ feedback: null })

    // Stop Notification Sound
    stopNotificationSound()
  }

  // On Snackbar View Task Click
  _onSnackbarViewTask = task => {
    const { dispatch } = this.props

    // Stop Notification Sound
    stopNotificationSound()


    // Close Feedback
    this._onFeedbackClose()  

    // Open Task Details Dialog with Selected Task
    this.setState({ isTaskDetailsOpen: true, selectedTask: task })  
  }

  render() {
    const { isTaskLoading, tasks, selectedStatus, autocompleteSelectedTask } = this.props
    const { feedback } = this.state
    
    let attendance_rows = this.mappedAttendanceInfo()
    const dyanmicColumns = this._generateAttendanceColumns()
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={[...columns, ...dyanmicColumns  ]}
          rows={ attendance_rows }
          loading={ isTaskLoading }
        />

        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          open={ Boolean(feedback) }
          autoHideDuration={ 10000 }
        >
          <Alert
            severity={ feedback?.status === 200 ? 'success' : 'error' }
            onClose={ this._onFeedbackClose }
            sx={{ width: '100%' }}
            action={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Button
                  color='inherit'
                  size='small'
                  onClick={ () => this._onSnackbarViewTask(feedback?.task) }
                >
                  { 'View Task' }
                </Button>

                <IconButton
                  onClick={ this._onFeedbackClose }
                  size='small'
                  sx={{ padding: 0 }}
                >
                  <Close fontSize='small' />
                </IconButton>
              </Box>
            }
          >
            { feedback?.message ? feedback.message : '' }
          </Alert>
        </Snackbar>
      </Box>
    )
  }
}

// Prop Types
AttendanceList.propTypes = {
  user: PropTypes.object,
  isTaskLoading: PropTypes.bool,
  tasks: PropTypes.array,
  selectedStatus: PropTypes.string,
  selectedDate: PropTypes.string,
  sndList: PropTypes.array,
  autocompleteSelectedTask: PropTypes.object,
  dispatch: PropTypes.func,
}

AttendanceList.defaultProps = {
  user: {},
  isTaskLoading: false,
  tasks: [],
  selectedStatus: '',
  selectedDate: '',
  sndList: [],
  autocompleteSelectedTask: null,
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state.auth.user,
  attendanceList: state.attendanceList.attendanceList,
  announcements: state.announcements.announcements,
  employeeList: state.employeeList.employeeList
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceList)