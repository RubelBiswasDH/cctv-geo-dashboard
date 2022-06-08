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
import { setInvalidLateAttendanceAction } from '../redux/actions/adminActions'
import dayjs from 'dayjs'
import { unionArrayOfObjects } from '../utils/utils'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.25, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
  // { field: 'day1', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },

 // { field: 'checked_out_time', headerName: 'Checked Out Time', minWidth: 75,flex: .75, sortable: false, filter: false, type: 'dateTime', filterable: false },      
 // { field: 'is_late', headerName: 'Late', minWidth: 50, sortable: false,flex: .50, filter: true, filterable: true  },
 // { field: 'announcement', headerName: 'Announcement', minWidth: 100, sortable: false,flex: 1, filter: true, filterable: true  },
 // { field: 'validation', headerName: 'Validation', minWidth: 50, sortable: false,flex: .5, filter: true, filterable: true  },
]


const rows = [{
      "id": 684,
      "name": "tkt-023846-1169",
      "checked_in_time": "AL- HAJ ABDUL JABBER",
      "caller_contact": "01778200359",
      "checked_out_time": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
      "is_late": "No",
  }
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
    //console.log(start_date,end_date)
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
    // console.log(attendanceList);
   
    let dates = []
    attendanceList.forEach(data => {
      dates.push(dayjs(data.enter_time).format("DD/MM/YYYY"))
    })

    const unique = [...new Set(dates)]

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

      const uniqueEmployee = unionArrayOfObjects([],attendanceList,'user_id')
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
          else {
            individualAttendance[enter_time] = "A"
          }
        } })

        getIndividualAttendance(a?.id)
        // console.log(individualAttendance)
      return ({
        "id": a?.id,
        "serial_no":i+1,
        "name": a?.name,
        ...individualAttendance
        // "day2": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        // "day3": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        // "day4": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        // "day5": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        // "checked_out_time": a?.exit_time?a?.exit_time : '-',
        // "is_late": (a?.is_late)?"Yes":"No",
        // "is_valid": a?.is_valid,
        // "announcement": getAnnouncement(a?.user_id, a?.created_at),
        // setValidation : setInvalidLateAttendanceAction({attendence_id:a?.id})
      })
    })
    // console.log("returing attendace info ", attendanceInfo)
    return attendanceInfo
    
  }


  // Sort Tasks By Emergency

  // Filter Tasks By Request Date


  // Filter Tasks By Status Type


  // Filter Tasks By Search

  // Open Task Details Dialog

 
  // Close Task Details Dialog

  // Open Task Timeline Dialog
  _openTaskTimeline = selectedTask => {
    const { sndList } = this.props

    // Set Loading
    this.setState({ isTimelineLoading: true, isTaskTimelineOpen: true })

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

  // Open Reminder for Emergency Tasks Periodically
 

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
    const { isTaskDetailsOpen, isTaskTimelineOpen, selectedTask, selectedTimeline, isTimelineLoading, feedback } = this.state
    
   
    let attendance_rows = this.mappedAttendanceInfo()
    const dyanmicColumns = this._generateAttendanceColumns()
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={[...columns, ...dyanmicColumns  ]}
          rows={ attendance_rows }
          loading={ isTaskLoading }
          // renderActions={ cellValues => ([
          //   <GridActionsCellItem
          //     icon={
          //       <Tooltip title='Dispatch' arrow={ true } placement='top'>
          //         <AssignmentInd fontSize='small' />
          //       </Tooltip>
          //     }
          //     onClick={ () => ("this._openTaskDetails(cellValues.row)") }
          //   />,
          //   <GridActionsCellItem
          //     icon={
          //       <Tooltip title='Timeline' arrow={ true } placement='top'>
          //         <Timeline fontSize='small' />
          //       </Tooltip>
          //     }
          //     onClick={ () => console.log("this._openTaskTimeline(cellValues.row)") }
          //   />
          // ])}
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
  // attendanceList
  attendanceList: state.attendanceList.attendanceList,
  announcements: state.announcements.announcements,
  employeeList: state.employeeList.employeeList
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceList)