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

import dayjs from 'dayjs'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50, maxWidth: 50, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 100, maxWidth: 120, sortable: false, filter: false, filterable: false },
  { field: 'checked_in_time', headerName: 'Checked In Time', minWidth: 200, maxWidth: 350, sortable: false, filter: false },
  { field: 'checked_out_time', headerName: 'Checked Out Time', minWidth: 150, maxWidth: 180, sortable: false, filter: false, type: 'dateTime', filterable: false },      
  { field: 'is_late', headerName: 'Late', minWidth: 150, maxWidth: 180, sortable: false, filter: false, filterable: false },
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

class TaskList extends React.PureComponent {
  state = {
    start_date:null,
    start_date: null,
    isTaskDetailsOpen: false,
    isTaskTimelineOpen: false,
    selectedTask: {},
    selectedTimeline: [
      {
          "message": "Task opened by Test user for IT",
          "time": "2022-04-20 15:19:13"
      },
      {
          "message": "Task viewed by Tamannna Pervin",
          "time": "2022-04-20 15:22:25"
      },
      {
          "message": "Task dispatched to Gulshan S&D Division by Tamannna Pervin.",
          "time": "2022-04-20 15:22:48"
      },
      {
          "message": "Task opened by Mr. S.M. Munzur Rashid",
          "time": "2022-04-20 15:23:05"
      },
      {
          "message": "Task dispatched to Gulshan S&D Division by Tamannna Pervin.",
          "time": "2022-04-20 15:23:34"
      },
      {
          "message": "Task resolved by Rupnagar S&D with remarks \"sssss\".",
          "time": "2022-04-21 13:24:00"
      }
  ],
    isTimelineLoading: false,
    feedback: null
  }

  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    console.log(start_date,end_date)
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
  mappedAttendanceInfo = () => {
    const {attendanceList} = this.props;
    console.log('mappedAttendanceInfo called', attendanceList);

    const isLate = (checked_in_time) => {
      const today = dayjs().format('YYYY-MM-DD')
      const lastCheckinTime = today+' 10:00:00'
      const checkedInTime = dayjs(checked_in_time).format('YYYY-MM-DD h:mm:ss')
      // console.log("lst chtime chtime: ", lastCheckinTime, checkedInTime)
      if(new Date(checkedInTime) > new Date(lastCheckinTime)){
        return "Yes"
      }
      else{
        return "No"
      }
    }

    const checkedOutTime = (user_id) => {
      const checkedOutUser = attendanceList.find(user => user.user_id === user_id && user.status === "exit")
      if (checkedOutUser) {
        return checkedOutUser.created_at
      }
      else {
        return "-"
      }

    }

    const attendanceInfo = attendanceList.filter((a) => a.status === 'enter' ).map((a,i) => {

      return ({
        "id": a.id,
        "serial_no":i+1,
        "name": a.name,
        "checked_in_time": a.created_at,
        "checked_out_time": attendanceList.find(user => user.user_id === a.user_id && user.status === "exit")?.created_at || '-',
        "is_late": isLate(a.created_at)
      })
    })
    console.log("returing attendace info ", attendanceInfo)
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
    if (user.user_type === 'SUPERVISOR') {      
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
        console.log("selectedTimeline",selectedTimeline)
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
    
   
    const demoTasks = {
      "columns": [
          {
              "field": "serial_no",
              "headerName": "Sl no",
              "minWidth": 50,
              "maxWidth": 50,
              "sortable": false,
              "filter": false,
              "filterable": false
          },
          {
              "field": "ticket_number",
              "headerName": "Name",
              "minWidth": 100,
              "maxWidth": 120,
              "sortable": false,
              "filter": false,
              "filterable": false
          },
          {
              "field": "created_by",
              "headerName": "Checked In Time",
              "minWidth": 200,
              "maxWidth": 350,
              "sortable": false,
              "filter": false
          },
          {
              "field": "dispatcher_name",
              "headerName": "Late",
              "minWidth": 200,
              "maxWidth": 350,
              "sortable": false,
              "filter": true,
              "type": "string"
          },
          {
              "field": "created_at",
              "headerName": "Checked in Date & Time",
              "minWidth": 150,
              "maxWidth": 180,
              "sortable": false,
              "filter": false,
              "type": "dateTime",
              "filterable": false
          },
          {
              "field": "snd_name",
              "headerName": "S&D Name",
              "minWidth": 200,
              "maxWidth": 350,
              "sortable": false,
              "filter": false,
              "type": "singleSelect",
              "valueOptions": [
                  {
                      "value": "Kafrul S&D Division",
                      "label": "Kafrul S&D Division",
                      "snd": {
                          "id": 1,
                          "snd_name": "Kafrul S&D Division",
                          "snd_area_name": "Kafrul",
                          "created_at": "2022-02-01T12:43:05.000000Z",
                          "updated_at": "2022-02-01T12:43:05.000000Z"
                      }
                  },
                  {
                      "value": "Pallabi S&D Division",
                      "label": "Pallabi S&D Division",
                      "snd": {
                          "id": 2,
                          "snd_name": "Pallabi S&D Division",
                          "snd_area_name": "Pallabi",
                          "created_at": "2022-02-01T12:40:58.000000Z",
                          "updated_at": "2022-02-01T12:40:58.000000Z"
                      }
                  },
                  {
                      "value": "Rupnagar S&D Division",
                      "label": "Rupnagar S&D Division",
                      "snd": {
                          "id": 3,
                          "snd_name": "Rupnagar S&D Division",
                          "snd_area_name": "Rupnagar",
                          "created_at": "2022-02-01T12:43:39.000000Z",
                          "updated_at": "2022-02-01T12:43:39.000000Z"
                      }
                  },
                  {
                      "value": "Shahali S&D Division",
                      "label": "Shahali S&D Division",
                      "snd": {
                          "id": 4,
                          "snd_name": "Shahali S&D Division",
                          "snd_area_name": "Shahali",
                          "created_at": "2022-02-01T12:40:04.000000Z",
                          "updated_at": "2022-02-01T12:40:04.000000Z"
                      }
                  },
                  {
                      "value": "Monipur S&D Division",
                      "label": "Monipur S&D Division",
                      "snd": {
                          "id": 5,
                          "snd_name": "Monipur S&D Division",
                          "snd_area_name": "Monipur",
                          "created_at": "2022-02-01T12:41:42.000000Z",
                          "updated_at": "2022-02-01T12:41:42.000000Z"
                      }
                  },
                  {
                      "value": "Agargaon S&D Division",
                      "label": "Agargaon S&D Division",
                      "snd": {
                          "id": 6,
                          "snd_name": "Agargaon S&D Division",
                          "snd_area_name": "Agargaon",
                          "created_at": "2022-02-01T12:43:21.000000Z",
                          "updated_at": "2022-02-01T12:43:21.000000Z"
                      }
                  },
                  {
                      "value": "Gulshan S&D Division",
                      "label": "Gulshan S&D Division",
                      "snd": {
                          "id": 7,
                          "snd_name": "Gulshan S&D Division",
                          "snd_area_name": "Gulshan",
                          "created_at": "2022-02-01T12:45:01.000000Z",
                          "updated_at": "2022-02-01T12:45:01.000000Z"
                      }
                  },
                  {
                      "value": "Badda S&D Division",
                      "label": "Badda S&D Division",
                      "snd": {
                          "id": 8,
                          "snd_name": "Badda S&D Division",
                          "snd_area_name": "Badda",
                          "created_at": "2022-02-01T12:38:53.000000Z",
                          "updated_at": "2022-02-01T12:38:53.000000Z"
                      }
                  },
                  {
                      "value": "Baridhara S&D Division",
                      "label": "Baridhara S&D Division",
                      "snd": {
                          "id": 9,
                          "snd_name": "Baridhara S&D Division",
                          "snd_area_name": "Baridhara",
                          "created_at": "2022-02-01T12:39:34.000000Z",
                          "updated_at": "2022-02-01T12:39:34.000000Z"
                      }
                  },
                  {
                      "value": "Uttara (East) S&D Division",
                      "label": "Uttara (East) S&D Division",
                      "snd": {
                          "id": 10,
                          "snd_name": "Uttara (East) S&D Division",
                          "snd_area_name": "Uttara (East)",
                          "created_at": "2022-02-01T12:41:16.000000Z",
                          "updated_at": "2022-02-01T12:41:16.000000Z"
                      }
                  },
                  {
                      "value": "Uttara (West) S&D Division",
                      "label": "Uttara (West) S&D Division",
                      "snd": {
                          "id": 11,
                          "snd_name": "Uttara (West) S&D Division",
                          "snd_area_name": "Uttara (West)",
                          "created_at": "2022-02-01T12:40:28.000000Z",
                          "updated_at": "2022-02-01T12:40:28.000000Z"
                      }
                  },
                  {
                      "value": "Tongi (East) S&D Division",
                      "label": "Tongi (East) S&D Division",
                      "snd": {
                          "id": 12,
                          "snd_name": "Tongi (East) S&D Division",
                          "snd_area_name": "Tongi (East)",
                          "created_at": "2022-02-01T12:44:30.000000Z",
                          "updated_at": "2022-02-01T12:44:30.000000Z"
                      }
                  },
                  {
                      "value": "Joarshahara S&D Division",
                      "label": "Joarshahara S&D Division",
                      "snd": {
                          "id": 13,
                          "snd_name": "Joarshahara S&D Division",
                          "snd_area_name": "Joarshahara",
                          "created_at": "2022-02-01T12:26:29.000000Z",
                          "updated_at": "2022-02-01T12:26:29.000000Z"
                      }
                  },
                  {
                      "value": "Uttarkhan S&D Division",
                      "label": "Uttarkhan S&D Division",
                      "snd": {
                          "id": 14,
                          "snd_name": "Uttarkhan S&D Division",
                          "snd_area_name": "Uttarkhan",
                          "created_at": "2022-02-01T12:35:30.000000Z",
                          "updated_at": "2022-02-01T12:35:30.000000Z"
                      }
                  },
                  {
                      "value": "Dakshinkhan S&D Division",
                      "label": "Dakshinkhan S&D Division",
                      "snd": {
                          "id": 15,
                          "snd_name": "Dakshinkhan S&D Division",
                          "snd_area_name": "Dakshinkhan",
                          "created_at": "2022-02-01T12:39:06.000000Z",
                          "updated_at": "2022-02-01T12:39:06.000000Z"
                      }
                  },
                  {
                      "value": "Tongi (West) S&D Division",
                      "label": "Tongi (West) S&D Division",
                      "snd": {
                          "id": 16,
                          "snd_name": "Tongi (West) S&D Division",
                          "snd_area_name": "Tongi (West)",
                          "created_at": "2022-02-01T12:42:03.000000Z",
                          "updated_at": "2022-02-01T12:42:03.000000Z"
                      }
                  },
                  {
                      "value": "Central_S&D",
                      "label": "Central_S&D",
                      "snd": {
                          "id": 17,
                          "snd_name": "Central_S&D",
                          "snd_area_name": "Central",
                          "created_at": null,
                          "updated_at": null
                      }
                  }
              ]
          },
          {
              "field": "etd_total_time",
              "headerName": "TAT",
              "minWidth": 150,
              "maxWidth": 200,
              "sortable": false,
              "filter": false,
              "filterable": false
          },
          {
              "field": "status",
              "headerName": "Name",
              "minWidth": 150,
              "maxWidth": 220,
              "sortable": false,
              "filter": false,
              "type": "singleSelect",
              "valueOptions": [
                  {
                      "value": "OPEN",
                      "label": "OPEN"
                  },
                  {
                      "value": "DISPATCHED",
                      "label": "DISPATCHED"
                  },
                  {
                      "value": "ASSIGNED",
                      "label": "ASSIGNED"
                  },
                  {
                      "value": "ONGOING",
                      "label": "ONGOING"
                  },
                  {
                      "value": "PRECOMPLETION",
                      "label": "TASK CLOSED"
                  },
                  {
                      "value": "RESOLVED",
                      "label": "RESOLVED"
                  },
                  {
                      "value": "CLOSED",
                      "label": "CLOSED"
                  },
                  {
                      "value": "CANCELLED",
                      "label": "CANCELLED"
                  }
              ]
          },
          {
              "field": "ticket_sla",
              "headerName": "Ticket SLA",
              "minWidth": 150,
              "maxWidth": 180,
              "sortable": false,
              "filter": false,
              "filterable": false
          }
      ],
      "rows": [
          {
              "id": 684,
              "ticket_number": "tkt-023846-1169",
              "caller_name": "AL- HAJ ABDUL JABBER",
              "caller_contact": "01778200359",
              "complain_address": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
              "query_category": "Bill",
              "connection_category": "LT",
              "remarks": "Test callgh fg hf h",
              "exact_address": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
              "query_id": null,
              "connection_status": null,
              "connection_account_status": null,
              "status": "DISPATCHED",
              "is_emergency": null,
              "is_information_correct": 1,
              "is_exact_address": 0,
              "is_active_user": 1,
              "completion_time": null,
              "caller_id": null,
              "dispatcher_id": 2,
              "snd_id": 7,
              "fieldforce_id": null,
              "assigned_by": null,
              "sanctioned_phase": "1",
              "latitude": 23.79139504,
              "longitude": 90.42544764,
              "created_at": "2022-04-20 15:19:13",
              "updated_at": "2022-04-24 10:22:52",
              "fieldforce_latitude": null,
              "fieldforce_longitude": null,
              "reopen": 1,
              "query_sub_category": "বিল কপি পাই নাই",
              "nearby_points": "Uttar Badda",
              "created_by": "Demo user for IT",
              "landmarks": "Suvastu",
              "dispatcher_name": "Tamannna Pervin",
              "snd_name": "Gulshan S&D Division",
              "fieldforce_name": null,
              "dispatched_time": 0.059722222222222,
              "resolved_time": "2022-04-21 13:24:00",
              "customer_phone": "01743946688",
              "assign_time": null,
              "dispatch_time": "2022-04-24 10:22:52",
              "pre_completion_time": null,
              "closed_time": null,
              "ticket_sla": null,
              "etd_total_time": null,
              "reopen_remarks": null,
              "serial_no": 1,
              "snd": "Gulshan S&D Division"
          },
          {
              "id": 683,
              "ticket_number": "tkt-023846-1169",
              "caller_name": "AL- HAJ ABDUL JABBER",
              "caller_contact": "01778200359",
              "complain_address": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
              "query_category": "Bill",
              "connection_category": "LT",
              "remarks": "Test call",
              "exact_address": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
              "query_id": null,
              "connection_status": null,
              "connection_account_status": null,
              "status": "OPEN",
              "is_emergency": null,
              "is_information_correct": 1,
              "is_exact_address": 0,
              "is_active_user": 1,
              "completion_time": null,
              "caller_id": null,
              "dispatcher_id": null,
              "snd_id": 8,
              "fieldforce_id": null,
              "assigned_by": null,
              "sanctioned_phase": "1",
              "latitude": 23.79139504,
              "longitude": 90.42544764,
              "created_at": "2022-04-20 15:13:35",
              "updated_at": "2022-04-20 15:13:35",
              "fieldforce_latitude": null,
              "fieldforce_longitude": null,
              "reopen": 0,
              "query_sub_category": "বিল কপি পাই নাই",
              "nearby_points": "Uttar Badda",
              "created_by": "Test user for IT",
              "landmarks": "Suvastu",
              "dispatcher_name": null,
              "snd_name": "Badda S&D Division",
              "fieldforce_name": null,
              "dispatched_time": null,
              "resolved_time": null,
              "customer_phone": "01743946688",
              "assign_time": null,
              "dispatch_time": null,
              "pre_completion_time": null,
              "closed_time": null,
              "ticket_sla": null,
              "etd_total_time": null,
              "reopen_remarks": null,
              "serial_no": 2,
              "snd": "Badda S&D Division"
          }
      ]
  } 
    let attendance_rows = this.mappedAttendanceInfo()
    return (
      <Box width='100%' height='380px'>
        <StyledDataGrid
          columns={columns }
          rows={ attendance_rows }
          loading={ isTaskLoading }
          renderActions={ cellValues => ([
            <GridActionsCellItem
              icon={
                <Tooltip title='Dispatch' arrow={ true } placement='top'>
                  <AssignmentInd fontSize='small' />
                </Tooltip>
              }
              onClick={ () => ("this._openTaskDetails(cellValues.row)") }
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title='Timeline' arrow={ true } placement='top'>
                  <Timeline fontSize='small' />
                </Tooltip>
              }
              onClick={ () => console.log("this._openTaskTimeline(cellValues.row)") }
            />
          ])}
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
TaskList.propTypes = {
  user: PropTypes.object,
  isTaskLoading: PropTypes.bool,
  tasks: PropTypes.array,
  selectedStatus: PropTypes.string,
  selectedDate: PropTypes.string,
  sndList: PropTypes.array,
  autocompleteSelectedTask: PropTypes.object,
  dispatch: PropTypes.func,
}

TaskList.defaultProps = {
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

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)