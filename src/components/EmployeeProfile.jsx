import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box } from '@mui/material'
import EmployeeList from './EmployeeList'
import FilterEmployee from './FilterEmployee'

class EmployeeProfile extends React.PureComponent {
 
  render() {
    return (
      <Box sx={{display:'flex', flexDirection:'column',width:'100%'}}>
        <FilterEmployee/>
        <EmployeeList/>
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
  currentView: state?.dashboard?.currentView

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile)