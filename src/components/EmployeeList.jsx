import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton, Typography } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Close } from '@mui/icons-material'
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import StyledDataGrid from './common/StyledDataGrid'
import StyledDialog from './common/StyledDialog'

// Import Actions & Methods
import { stopNotificationSound } from '../utils/utils'
import { getUserProfile, deleteUser } from '../redux/actions/adminActions'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setUserProfile, setProfileEdit } from "../redux/reducers/adminReducer"

import dayjs from 'dayjs'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.3, sortable: false, filter: false, filterable: false },
  { field: 'view_profile', headerName: 'Profile', minWidth: 100, sortable: false,flex: .6, filter: false, filterable: false  },
  { field: 'delete_user', headerName: 'Action', minWidth: 100, sortable: false,flex: .6, filter: false, filterable: false  },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'email', headerName: 'Email', minWidth: 150, flex: 1, sortable: false, filter: false,filterable: false },
  { field: 'phone', headerName: 'Phone', minWidth: 150,flex:1, sortable: false, filter: false, type: 'dateTime', filterable: false },      
]

class EmployeeList extends React.PureComponent {
  state = {
    start_date:null,
    isDeleteDialogOpen: false,
    selectedUserId: '',
    selectedTask: {},
    selectedTimeline: [
  ],
    isTimelineLoading: false,
    feedback: null
  }

  componentDidMount() {
    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    this.setState({ start_date, end_date })
  }

  // On Feedback Close
  _onFeedbackClose = () => {
    this.setState({ feedback: null })
  } 

  // On Snackbar View Task Click
  _onSnackbarViewTask = task => {
    // Stop Notification Sound
    stopNotificationSound()


    // Close Feedback
    this._onFeedbackClose()
 

    // Open Task Details Dialog with Selected Task
    this.setState({ isTaskDetailsOpen: true, selectedTask: task })  
  }

  transformedEmployeeList = () => {

    const currentView = this.props.currentView
    const { currentEmployeeType } = this.props

    var empData = (this.props.employeeList)?.map(emp => ({
      ...emp,
      profile:JSON.parse(emp.profile)
    }))

    var data = []
    if(empData.length > 0){

    switch (currentEmployeeType) {
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
      },
      deleteUser: () => {
        this._handleDeleteDialogOpen(emp.id)
      },
    }))
  }

  _handleDeleteDialogClose = () => {
    this.setState({selectedUserId:''})
    this.setState({isDeleteDialogOpen:false})
  }

  _handleDeleteDialogOpen = (id) => {
    this.setState({selectedUserId:id})
    this.setState({isDeleteDialogOpen:true})
  }

  _handleDeleteUser = () => {
    const { selectedUserId } = this.state
    this.props.dispatch(deleteUser(selectedUserId))
    this.setState({selectedUserId:''})
    this.setState({isDeleteDialogOpen:false})
  }

  render() {
    const { isTaskLoading } = this.props
    const { feedback } = this.state
    
    return (
      <Box width='100%' height='73vh'>
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
        <StyledDialog 
          isDialogOpen={ this.state.isDeleteDialogOpen }
          handleDialogOnClose = { this._handleDeleteDialogClose }
          footer={
            <>
              <Button onClick={ this._handleDeleteDialogClose }><Typography>Cancel</Typography></Button>
              <Button onClick={ this._handleDeleteUser }><Typography sx={{color:'red'}}>Yes</Typography></Button>
            </>
          }
        >
          <Typography sx={{fontSize:'1em'}}>Are you sure you want to delete this user?</Typography>
        </StyledDialog>
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
  attendanceList: PropTypes.array,
  employeeList: PropTypes.array,
  currentView: PropTypes.string,
  dispatch: PropTypes.func,
}

EmployeeList.defaultProps = {
  user: {},
  attendanceList: [],
  employeeList: [],
  currentView: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state.auth.user,
  attendanceList: state?.attendanceList?.attendanceList,
  employeeList: state?.employeeList?.employeeList,
  currentView: state?.dashboard?.currentView,
  currentEmployeeType: state?.employeeList?.currentEmployeeType
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList)