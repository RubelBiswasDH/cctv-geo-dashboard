import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import StyledDialog from './common/StyledDialog'
import { Box, Button, Typography } from '@mui/material'
import EmployeeList from './EmployeeList'
import FilterEmployee from './FilterEmployee'

class EmployeeProfile extends React.PureComponent {
 
  render() {
    const { isUpdateDialogOpen, isDeleteDialogOpen } = this.props
    return (
      <Box sx={{display:'flex', flexDirection:'column',width:'100%'}}>
        <FilterEmployee/>
        <EmployeeList/>
        <StyledDialog 
          isDialogOpen={ isUpdateDialogOpen }
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
        {/* <StyledDialog 
          isDialogOpen={ isDeleteDialogOpen }
          handleDialogOnClose = { this._handleDeleteDialogClose }
          footer={
            <>
              <Button onClick={ this._handleDeleteDialogClose }><Typography>Cancel</Typography></Button>
              <Button onClick={ this._handleDeleteUser }><Typography sx={{color:'red'}}>Yes</Typography></Button>
            </>
          }
        >
          <Typography sx={{fontSize:'1em'}}>Are you sure you want to delete this user?</Typography>
        </StyledDialog> */}
      </Box>
    )
  }
}

// Prop Types
EmployeeList.propTypes = {
  dispatch: PropTypes.func,
}

EmployeeList.defaultProps = {
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state?.auth.user,
  attendanceList: state?.attendanceList?.attendanceList,
  employeeList: state?.employeeList?.employeeList,
  currentView: state?.dashboard?.currentView,
  isDeleteDialogOpen: state?.employeeList?.isDeleteDialogOpen,
  isUpdateDialogOpen: state?.employeeList?.isUpdateDialogOpen,

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile)