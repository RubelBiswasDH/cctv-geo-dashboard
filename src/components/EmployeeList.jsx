import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Button, Typography, TextField } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import StyledDataGrid from './common/StyledDataGrid'
import StyledDialog from './common/StyledDialog'
import StyledTextField from './common/StyledTextField'
import StyledDropdown from './common/StyledDropdown'

// Import Actions & Methods
import { stopNotificationSound } from '../utils/utils'
import { getUserProfile, deleteUser, updateUser } from '../redux/actions/adminActions'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setUserProfile, setProfileEdit } from "../redux/reducers/adminReducer"
import { updateNewUser, updateNewUserProfile, setSelectedUserId, setUserDeleteReason } from '../redux/reducers/adminReducer'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"

import dayjs from 'dayjs'


const columns = [      
  { field: 'name', headerName: 'Name', minWidth: 200,flex:1, sortable: true, filter: true, filterable: true },
  { field: 'email', headerName: 'Email', minWidth: 150, flex: .75, sortable: true, filter: true,filterable: false },
  { field: 'phone', headerName: 'Mobile Number', minWidth: 150,flex:.75, sortable: true, filter: false, type: 'dateTime', filterable: false },
  { field: 'designation', headerName: 'Designation', minWidth: 150,flex:.75, sortable: true, filter: false, filterable: false },      
  { field: 'department', headerName: 'Department', minWidth: 150,flex:.75, sortable: true, filter: false, filterable: false },      
  { field: 'update_user', headerName: 'Action', minWidth: 100, sortable: false,flex: .5, filter: false, filterable: false  },
]

class EmployeeList extends React.PureComponent {
  state = {
    start_date:null,
    isDeleteDialogOpen: false,
    isUpdateDialogOpen: false,
    selectedUserId: '',
    deleteUserReason: '',
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
      designation:emp?.profile?.designation,
      department: emp?.profile?.department,
      serial_no:i+1,
      viewProfile: () => {
        this.props.dispatch(setProfileEdit(false))
        this.props.dispatch(setUserProfile({}))
        this.props.dispatch(getUserProfile(emp.id))
        this.props.dispatch(setCurrentView('profile'))
      },
      updateUser: () => {
        this._handleUpdateDialogOpen(emp.id)
      },
    }))
  }



  _handleUpdateDialogClose = () => {
    const { dispatch } = this.props
    dispatch( setSelectedUserId(''))
    this.setState({ isUpdateDialogOpen:false })
  }

  _handleUpdateDialogOpen = (id) => {
    const { dispatch, employeeList } = this.props
    dispatch( setSelectedUserId(id))
    const emp = employeeList.find(emp => emp.id === id)
    const empProfile = JSON.parse(emp.profile)
    dispatch(updateNewUser({
      name:emp?.name || '',
      phone: emp?.phone || '',
      email: emp?.email || '',
      profile: {
        designation: empProfile?.designation || '',
        department: empProfile?.department || '',
      }
    }))
  
    this.setState({ isUpdateDialogOpen:true })
  }
  _handleUpdateeUser = () => {
    const { dispatch, selectedUserId, newUser } = this.props
    const userData = {
      ...newUser,
      profile: JSON.stringify(newUser?.profile)
    }
    dispatch(updateUser(selectedUserId, userData))

  }


  _handleDeleteDialogOpen = (id) => {
    this.setState({isDeleteDialogOpen:true})
  }
  _handleDeleteUserReason = (e) => {
    const { dispatch } = this.props
    dispatch( setUserDeleteReason(e.target.value))

  }

  _handleDeleteUser = () => {
    const { dispatch, selectedUserId, userDeleteReason } = this.props
    if(userDeleteReason && userDeleteReason.length){
      dispatch(
        deleteUser(
          selectedUserId,
          {
            deleted_reason: userDeleteReason
          }
          ))
          this._handleDeleteDialogClose()
          this._handleUpdateDialogClose()
          dispatch(setSelectedUserId(''))
          dispatch( setUserDeleteReason(''))
    }
    else {
      dispatch(setToastMessage("Deleting reason is required !")) 
      dispatch(setToastIsOpen(true)) 
      dispatch(setToastSeverity("warning"))
    }


  }
  _handleDeleteDialogClose = () => {
    this.setState({isDeleteDialogOpen:false})
  }
  render() {
    const { isTaskLoading, newUser, companySettings } = this.props
    
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
          title = {'Reason of Deleting the Employee'}
          footer={
            <>
              <Button variant='contained' color={'secondary'} onClick={ this._handleDeleteDialogClose }><Typography>Cancel</Typography></Button>
              <Button variant='contained' color={'error'} onClick={ this._handleDeleteUser }><Typography>DELETE</Typography></Button>
            </>
          }
        > 
          <TextField onChange={ this._handleDeleteUserReason } fullWidth sx={{fontSize:'1em'}}></TextField>
        </StyledDialog>
        <StyledDialog 
          isDialogOpen={ this.state.isUpdateDialogOpen }
          handleDialogOnClose = { this._handleUpdateDialogClose }
          footer={
            <Box sx={{
                  display:'flex',
                  justifyContent:'space-between', 
                  width:'100%', 
                  px:5,
                  py:2,
                }}>
              <Button variant='contained' color={'error'} onClick={ this._handleDeleteDialogOpen }><Typography>DELETE</Typography></Button>
              <Button variant='contained' color={'success'} onClick={ this._handleUpdateeUser }><Typography>UPDATE</Typography></Button>
            </Box>
          }
        >
          <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:3}}>
              <StyledTextField action={ updateNewUser } field={'name'} title={"Name : "} value={newUser?.name} fieldStyle={{ width:'50%' }}/>
              <StyledTextField action={ updateNewUser } field={'phone'} title={"Mobile : "} value={newUser?.phone} fieldStyle={{ width:'50%' }}/>
              <StyledTextField action={ updateNewUser } field={'email'}  title={"Email : "} value={newUser?.email} fieldStyle={{ width:'50%' }}/>
              <Box sx={{display:'flex', flexDirection:'row',  width:'100%' }}>
                  <StyledDropdown 
                      filterOptions={Object.keys(companySettings?.departments ) || []} 
                      action={ updateNewUserProfile }  
                      field={'profile'} 
                      subField={'department'} 
                      value={newUser?.profile?.department} 
                      fieldStyle={{ width:'90%' }}
                  />
                  <StyledDropdown 
                      filterOptions={ companySettings?.departments[newUser?.profile?.department]?.designations || [] }
                      action={ updateNewUserProfile }  
                      field={'profile'} 
                      subField={'designation'}  
                      value={ newUser?.profile?.designation }
                      fieldStyle={{ width:'90%' }}
                  />
              </Box>
          </Box>
        </StyledDialog>
      </Box>
    )
  }
}

// Prop Types
EmployeeList.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  attendanceList: PropTypes.array,
  employeeList: PropTypes.array,
  currentView: PropTypes.string,
  newUser: PropTypes.object,
}

EmployeeList.defaultProps = {
  dispatch: () => null,
  user: {},
  attendanceList: [],
  employeeList: [],
  currentView: '',
  newUser: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  attendanceList: state?.attendanceList?.attendanceList,
  employeeList: state?.employeeList?.employeeList,
  companySettings: state?.admin?.companySettings,
  currentView: state?.dashboard?.currentView,
  currentEmployeeType: state?.employeeList?.currentEmployeeType,
  newUser: state?.admin?.newUser,
  selectedUserId: state?.admin?.selectedUserId,
  userDeleteReason: state?.admin?.userDeleteReason,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList)