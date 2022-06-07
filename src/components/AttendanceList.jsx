import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { AssignmentInd, Timeline, Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'
import TaskDetailsDialog from './TaskDetailsDialog'
import TaskTimelineDialog from './TaskTimelineDialog'

// Import Actions & Methods
import { setAutocompleteSelectedTask, setSelectedStatusType } from '../redux/reducers/taskReducer'
import { getTimelineData, sendTaskClickCount } from '../redux/actions/taskActions'
import { playNotificationSound, stopNotificationSound } from '../utils/utils'
import {getAttendance}  from '../redux/actions/attendanceActions'
import { setInvalidLateAttendanceAction } from '../redux/actions/adminActions'
import dayjs from 'dayjs'


const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 25,flex:.25, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 100,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'day1', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  { field: 'day2', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  { field: 'day3', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  { field: 'day4', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  { field: 'day5', headerName: 'Checked In Time', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  
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
    feedback: null
  }

  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    //console.log(start_date,end_date)
    this.setState({ start_date, end_date })

    // Load Tasks
    dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )

    // dispatch( getAttendance({start_date: `${start_date} 00:00:00`, end_date: `${end_date} 23:59:59`}) )

    //dispatch(getAttendance());
    //console.log(dateToday())
    // // Get All Task List
    // dispatch( loadTasks() )

    // Pending Emergency Reminder
    // this._setReminderForEmergency()
  }

// mapAttendanceColums=()=>{
//   const {attendanceList} =this.props;
// const columns = attendanceList.map((a,i)=>{

//   return({
     
//   })
// }) 
// }

  mappedAttendanceInfo = () => {
    const {attendanceList, announcements} = this.props;
    // console.log(attendanceList);
   
    let dates = []
    attendanceList.map(data=>(
      dates.push(dayjs(data.enter_time).format("DD/MM/YYYY"))
    

    ))
    const unique = [...new Set(dates)]
    console.log(unique)
   

    // console.log({announcements})
    //console.log('mappedAttendanceInfo called', attendanceList);

    // const isLate = (checked_in_time) => {
    //   const today = dayjs(checked_in_time).format('YYYY-MM-DD')
    //   const lastCheckinTime = today+' 10:15:00'
    //   //const checkedInTime = dayjs(checked_in_time).format('YYYY-MM-DD h:mm:ss')
    //   //console.log("lst chtime chtime: ", lastCheckinTime, checkedInTime)
    //   if(new Date(checked_in_time) > new Date(lastCheckinTime)){
    //     return "Yes"
    //   }
    //   else{
    //     return "No"
    //   }
    // }

    const getAnnouncement = (id,date) => {
      if(announcements.length > 0){
        const announcement = announcements.filter(an => (an.user_id === id && dayjs(an?.created_at).format('YYYY-MM-DD')=== dayjs(date).format('YYYY-MM-DD')))[0]
        if (announcement && announcement?.type=="LATE"){
          return announcement?.description
        }
        
      }
      else return ''
    }

   

    const attendanceInfo = attendanceList.map((a,i) => {

      return ({
        "id": a?.id,
        "serial_no":i+1,
        "name": a?.name,
        "day1": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "day2": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "day3": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "day4": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "day5": dayjs(a?.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "checked_out_time": a?.exit_time?a?.exit_time : '-',
        "is_late": (a?.is_late)?"Yes":"No",
        "is_valid": a?.is_valid,
        "announcement": getAnnouncement(a?.user_id, a?.created_at),
        setValidation : setInvalidLateAttendanceAction({attendence_id:a?.id})
      })
    })
    // console.log("returing attendace info ", attendanceInfo)
    return attendanceInfo
    
  }

  // Generate Columns & Rows
  _generateTaskColumnsAndRows = tasks => {
    const { sndList, user } = this.props

    const columns = [      
      { field: 'serial_no', headerName: 'Sl no', minWidth: 50, maxWidth: 50, sortable: false, filter: false, filterable: false },
      { field: 'ticket_number', headerName: 'Name', minWidth: 100, maxWidth: 120, sortable: false, filter: false, filterable: false },
      { field: 'created_by', headerName: 'Checked In', minWidth: 200, maxWidth: 350, sortable: false, filter: false },
      { field: 'created_at', headerName: 'Created Date & Time', minWidth: 150, maxWidth: 180, sortable: false, filter: false, type: 'dateTime', filterable: false },      
      { field: 'snd_name', headerName: 'S&D Name', minWidth: 200, maxWidth: 350, sortable: false, filter: false, type: 'singleSelect', valueOptions: sndList },
      { field: 'etd_total_time', headerName: 'TAT', minWidth: 150, maxWidth: 200, sortable: false, filter: false, filterable: false },
      { field: 'status', headerName: 'Name', minWidth: 150, maxWidth: 220, sortable: false, filter: false, type: 'singleSelect', valueOptions: [
        { value: 'OPEN', label: 'OPEN' },
        { value: 'DISPATCHED', label: 'DISPATCHED' },
        { value: 'ASSIGNED', label: 'ASSIGNED' },
        { value: 'ONGOING', label: 'ONGOING' },
        { value: 'PRECOMPLETION', label: 'TASK CLOSED' },
        { value: 'RESOLVED', label: 'RESOLVED' },
        { value: 'CLOSED', label: 'CLOSED' },
        { value: 'CANCELLED', label: 'CANCELLED' }        
      ] },
      { field: 'ticket_sla', headerName: 'Ticket SLA', minWidth: 150, maxWidth: 180, sortable: false, filter: false, filterable: false },
    ]

    const rows = tasks ?
      tasks.map((t, index) => ({
        ...t,
        serial_no: index + 1,
        snd: sndList.find(s => s.snd.id === t.snd_id)?.snd?.snd_name ?? ''
      }))
      :
      []

    // Check if user is 'SUPERVISOR' and add a new column in columns at 3rd position
    if (user.user_type === 'ADMIN') {      
      columns.splice(3, 0, { field: 'dispatcher_name', headerName: 'Dispatcher Name', minWidth: 200, maxWidth: 350, sortable: false, filter: true, type: 'string'})
    }

    return {
      columns,
      rows
    }
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

    // Get Timeline Data
    getTimelineData(selectedTask.id, sndList)
      .then(selectedTimeline => {
        //console.log("selectedTimeline",selectedTimeline)
        //this.setState({ selectedTimeline, isTimelineLoading: false })
      })
      .catch(err => {
        console.error(err)
        this.setState({ isTimelineLoading: false, selectedTimeline: [] })
      })
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

    if(!task) {
      dispatch( setAutocompleteSelectedTask(null) )
      return
    }

    // Close Feedback
    this._onFeedbackClose()

    dispatch( setAutocompleteSelectedTask(task) )    

    // Auto Select All Status Type
    dispatch( setSelectedStatusType('ALL') )

    // Open Task Details Dialog with Selected Task
    this.setState({ isTaskDetailsOpen: true, selectedTask: task })  
  }

  render() {
    const { isTaskLoading, tasks, selectedStatus, autocompleteSelectedTask } = this.props
    const { isTaskDetailsOpen, isTaskTimelineOpen, selectedTask, selectedTimeline, isTimelineLoading, feedback } = this.state
    
   
    let attendance_rows = this.mappedAttendanceInfo()
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={columns }
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

        <TaskDetailsDialog
          data={ selectedTask }
          handleDialogOnClose={ this._closeTaskDetails }
          isDialogOpen={ isTaskDetailsOpen }
        />

        <TaskTimelineDialog
          isDialogOpen={ isTaskTimelineOpen }
          handleDialogOnClose={ this._closeTaskTimeline }
          timelineData={ selectedTimeline }
          loading={ isTimelineLoading }
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
  isTaskLoading: state.task.isTaskLoading,
  tasks: state.task.tasks,
  selectedStatus: state.task.selectedStatus,
  selectedDate: state.task.selectedDate,
  sndList: state.task.sndList,
  autocompleteSelectedTask: state.task.autocompleteSelectedTask,
  // attendanceList
  attendanceList: state.attendanceList.attendanceList,
  announcements: state.announcements.announcements,

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceList)