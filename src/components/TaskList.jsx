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

class TaskList extends React.PureComponent {
  state = {
    isTaskDetailsOpen: false,
    isTaskTimelineOpen: false,
    selectedTask: {},
    selectedTimeline: [],
    isTimelineLoading: false,
    feedback: null
  }

  componentDidMount() {
    // const { dispatch } = this.props

    // // Get All Task List
    // dispatch( loadTasks() )

    // Pending Emergency Reminder
    this._setReminderForEmergency()
  }

  // Generate Columns & Rows
  _generateTaskColumnsAndRows = tasks => {
    const { sndList, user } = this.props

    const columns = [      
      { field: 'serial_no', headerName: 'Sl no', minWidth: 50, maxWidth: 50, sortable: false, filter: false, filterable: false },
      { field: 'ticket_number', headerName: 'Ticket ID', minWidth: 100, maxWidth: 120, sortable: false, filter: false, filterable: false },
      { field: 'created_by', headerName: 'Created by', minWidth: 200, maxWidth: 350, sortable: false, filter: false },
      { field: 'created_at', headerName: 'Created Date & Time', minWidth: 150, maxWidth: 180, sortable: false, filter: false, type: 'dateTime', filterable: false },      
      { field: 'snd_name', headerName: 'S&D Name', minWidth: 200, maxWidth: 350, sortable: false, filter: false, type: 'singleSelect', valueOptions: sndList },
      { field: 'etd_total_time', headerName: 'TAT', minWidth: 150, maxWidth: 200, sortable: false, filter: false, filterable: false },
      { field: 'status', headerName: 'Ticket Status', minWidth: 150, maxWidth: 220, sortable: false, filter: false, type: 'singleSelect', valueOptions: [
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
  _sortTasksByEmergency = tasks => {
    if(!tasks) {
      return []
    }

    return [ ...tasks ].sort((t1, t2) => {
      const t1Em = t1?.is_emergency ?? 0
      const t2Em = t2?.is_emergency ?? 0

      return t2Em - t1Em
    })
  }

  // Filter Tasks By Request Date
  _filterTasksByDate = (tasks, selectedDate) => {
    if(!tasks) {
      return []
    }

    const filteredTasks = tasks.filter(t => String(t.created_at).includes(selectedDate))

    return filteredTasks
  }

  // Filter Tasks By Status Type
  _filterTasksByStatus = (tasks, selectedStatus) => {
    if(!tasks) {
      return []
    }

    if(!selectedStatus || selectedStatus === 'ALL') {
      return tasks
    }

    const filteredTasks = tasks.filter(t => t.status === selectedStatus)
    
    return filteredTasks
  }

  // Filter Tasks By Search
  _filterByAutocompleteSelectedTask = (tasks, autocompleteSelectedTask) => {
    if(!tasks) {
      return []
    }

    if(!autocompleteSelectedTask) {
      return tasks
    }

    const filteredTasks = tasks.filter(t =>
      t.ticket_number.toLowerCase().includes(autocompleteSelectedTask.ticket_number.toLowerCase())
    )
    
    return filteredTasks
  }

  // Open Task Details Dialog
  _openTaskDetails = selectedTask => {
    const { user } = this.props
    this.setState({ isTaskDetailsOpen: true, selectedTask })    
    
    // Send Task Click Count
    if(selectedTask.id && user.user_type === 'DISPATCHER') {
      sendTaskClickCount(selectedTask.id)
    }
  }

  // Close Task Details Dialog
  _closeTaskDetails = () => {
    this.setState({ isTaskDetailsOpen: false, selectedTask: {} })
  }

  // Open Task Timeline Dialog
  _openTaskTimeline = selectedTask => {
    const { sndList } = this.props

    // Set Loading
    this.setState({ isTimelineLoading: true, isTaskTimelineOpen: true })

    // Get Timeline Data
    getTimelineData(selectedTask.id, sndList)
      .then(selectedTimeline => {
        this.setState({ selectedTimeline, isTimelineLoading: false })
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
  _setReminderForEmergency = () => {
    setInterval(() => {
      const { tasks } = this.props

      const emergencies = tasks.filter(t => t.is_emergency && t.status !== 'CLOSED')

      if(!emergencies?.length) {
        this.setState({ feedback: null })
        return
      }

      let index = 0
      const intervalId = setInterval(() => {
        if(index >= emergencies.length) {
          index = 0
          clearInterval(intervalId)
          return
        }

        const feedback = {
          status: 400,
          message: `[${ emergencies[ index ].ticket_number }] emergency pending!`,
          task: emergencies[ index ]
        }
  
        this.setState({ feedback })

        // Play emergency sound
        playNotificationSound('emergency')

        index++
      }, 12000)

    }, 600000)
  }

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
    const sortedByEmergency = this._sortTasksByEmergency(tasks)    
    const tasksByStatus = this._filterTasksByStatus(sortedByEmergency, selectedStatus)
    const tasksBySearchQuery = this._filterByAutocompleteSelectedTask(tasksByStatus, autocompleteSelectedTask)
    const transformedTasks = this._generateTaskColumnsAndRows(tasksBySearchQuery)
    
    return (
      <Box width='100%' height='380px'>
        <StyledDataGrid
          columns={ transformedTasks.columns }
          rows={ transformedTasks.rows }
          loading={ isTaskLoading }
          renderActions={ cellValues => ([
            <GridActionsCellItem
              icon={
                <Tooltip title='Dispatch' arrow={ true } placement='top'>
                  <AssignmentInd fontSize='small' />
                </Tooltip>
              }
              onClick={ () => this._openTaskDetails(cellValues.row) }
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title='Timeline' arrow={ true } placement='top'>
                  <Timeline fontSize='small' />
                </Tooltip>
              }
              onClick={ () => this._openTaskTimeline(cellValues.row) }
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
  autocompleteSelectedTask: state.task.autocompleteSelectedTask
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)