import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { AssignmentInd, Timeline, Close, AccountBoxSharpIcon } from '@mui/icons-material'
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import StyledDataGrid from './common/StyledDataGrid'

// Import Actions & Methods
import { playNotificationSound, stopNotificationSound } from '../utils/utils'
import {getEmployee}  from '../redux/actions/employeeActions'
import {getUserProfile} from '../redux/actions/adminActions'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import {setUserProfile, setProfileEdit} from "../redux/reducers/adminReducer"
import { setView } from '../utils/utils'

import dayjs from 'dayjs'

const empData = [
    {
        id:52,
        company_id:1,
        user_id:4,
        enter_time:"2022-05-09 11:22:10",
        created_at:"2022-05-09 11:22:10",
        updated_at:"2022-05-09 11:22:10",
        serial_no:'1',
        name:"Tayef",
        email:'t@gmail.com',
        phone: '01911135345',
        gender: 'male',
        probation: false,
        in_service: true
    },
    {
        id:51,
        company_id:1,
        user_id:9,
        enter_time:"2022-05-09 11:14:22",
        created_at:"2022-05-09 11:14:22",
        updated_at:"2022-05-09 11:14:22",
        serial_no:'2',
        name:"Hasnain",
        email:'h@gmail.com',
        phone: '019132435115',
        gender: 'male',
        probation: false,
        in_service: true
    },
    {
        id:50,
        company_id:1,
        user_id:7,
        enter_time:"2022-05-09 10:52:33",
        created_at:"2022-05-09 10:52:33",
        updated_at:"2022-05-09 10:52:33",
        serial_no:'3',
        name:"Hafizur Milon",
        email: 'ha@gmail.com',
        phone: '019132435345',
        gender: 'male',
        probation: false,
        in_service: true,
    },
    {
        id:44,
        company_id:1,
        user_id:18,
        enter_time:"2022-05-09 10:13:37",
        exit_time:null,
        created_at:"2022-05-09 10:13:37",
        updated_at:"2022-05-09 10:13:37",
        serial_no:'4',
        name:"MD. YEASIN ALI",
        email: 'hfa@gmail.com',
        phone: '019132345345',
        gender: 'male',
        probation: true,
        in_service: true,
    },
    {
        id:40,
        company_id:1,
        user_id:2,
        enter_time:"2022-05-09 09:49:45",
        exit_time:null,
        created_at:"2022-05-09 09:49:45",
        updated_at:"2022-05-09 09:49:45",
        serial_no:'5',
        name:"Pushpo",
        email: 'hpa@gmail.com',
        phone: '019132345345',
        gender: 'female',
        probation: false,
        in_service: true,
    },
    {
        id:432,
        company_id:1,
        user_id:2,
        enter_time:"2022-05-09 09:49:45",
        exit_time:null,
        created_at:"2022-05-09 09:49:45",
        updated_at:"2022-05-09 09:49:45",
        serial_no:'6',
        name:"Jane",
        email: 'jane@gmail.com',
        phone: '019542345345',
        gender: 'female',
        probation: false,
        in_service: false,
    }
  ]

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.3, sortable: false, filter: false, filterable: false },
  { field: 'view_profile', headerName: 'Profile', minWidth: 100, sortable: false,flex: .6, filter: false, filterable: false  },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'email', headerName: 'Email', minWidth: 150, flex: 1, sortable: false, filter: false,filterable: false },
  { field: 'phone', headerName: 'Phone', minWidth: 150,flex:1, sortable: false, filter: false, type: 'dateTime', filterable: false },      
//   { field: 'is_late', headerName: 'Late', minWidth: 50, sortable: false,flex: .3, filter: true, filterable: true  },
]
const rows = [
  {
      "id": 684,
      "name": "tkt-023846-1169",
      "checked_in_time": "AL- HAJ ABDUL JABBER",
      "caller_contact": "01778200359",
      "checked_out_time": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
      "is_late": "No",
  }
]

class EmployeeList extends React.PureComponent {
  state = {
    start_date:null,
    start_date: null,
    isTaskDetailsOpen: false,
    isTaskTimelineOpen: false,
    selectedTask: {},
    selectedTimeline: [
  ],
    isTimelineLoading: false,
    feedback: null
  }

  componentDidMount() {
    const { dispatch, employeeList } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    //console.log(start_date,end_date)
    this.setState({ start_date, end_date })

    // Load Tasks
    // dispatch( getEmployee() )

    // dispatch( getAttendance({start_date: `${start_date} 00:00:00`, end_date: `${end_date} 23:59:59`}) )

    //dispatch(getAttendance());
    //console.log(dateToday())
    // // Get All Task List
    // dispatch( loadTasks() )

    // Pending Emergency Reminder
    // this._setReminderForEmergency()
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

  transformedEmployeeList = () => {

    const currentView = this.props.currentView
    var empData = (this.props.employeeList)?.map(emp => ({
      ...emp,
      profile:JSON.parse(emp.profile)
    }))

    var data = []
    if(empData.length > 0){

    switch (currentView) {
        case 'intern':
            data = empData.filter(emp => emp?.profile?.job_status?.toLowerCase()==='intern');
            break;
        case 'probational_period':
            data = empData.filter(emp => emp?.profile?.job_status?.toLowerCase()==='probation');
            break;
        case 'males':
            data = empData.filter(emp => emp?.profile?.gender?.toLowerCase() === 'male');
            break;
        case 'females':
            data = empData.filter(emp => emp?.profile?.gender?.toLowerCase() === 'female');
            break;
        default:
          data = empData;
      } 
      
    }
    return data.map((emp,i) => ({
      ...emp,
      serial_no:i+1,
      viewProfile: () => {
        this.props.dispatch(setProfileEdit(false))
        this.props.dispatch(setUserProfile({}))
        this.props.dispatch(getUserProfile(emp.id))
        this.props.dispatch(setCurrentView('profile'))
      }
    }))
  }

  render() {
    const { isTaskLoading, employeeList } = this.props
    const { isTaskDetailsOpen, isTaskTimelineOpen, selectedTask, selectedTimeline, isTimelineLoading, feedback } = this.state
    
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={columns }
          rows={this.transformedEmployeeList()}
          loading={ isTaskLoading }
          renderActions={ cellValues => ([
            <GridActionsCellItem
              icon={
                <Tooltip title='View Profile' arrow={ true } placement='top'>
                  <ManageAccountsSharpIcon fontSize='small' />
                </Tooltip>
              }
              onClick={ () => ("this._openTaskDetails(cellValues.row)") }
            />
          ]
            )}
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
EmployeeList.propTypes = {
  user: PropTypes.object,
  isTaskLoading: PropTypes.bool,
  tasks: PropTypes.array,
  selectedStatus: PropTypes.string,
  selectedDate: PropTypes.string,
  sndList: PropTypes.array,
  autocompleteSelectedTask: PropTypes.object,
  dispatch: PropTypes.func,
}

EmployeeList.defaultProps = {
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
  employeeList: state.employeeList.employeeList,
  currentView: state.dashboard.currentView

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList)