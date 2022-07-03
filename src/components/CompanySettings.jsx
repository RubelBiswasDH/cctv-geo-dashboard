import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// Import Components
import { Box, Paper, Button, Typography } from '@mui/material'
import StyledTextField from '../components/common/StyledTextField'
// Import Actions & Methods

import { updateCompanyDepartments } from '../redux/reducers/adminReducer'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"

import { getAttendance }  from '../redux/actions/attendanceActions'
import { getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'

import { setCurrentDepartment, updateCurrentDesignations } from "../redux/reducers/companySettingsReducer"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { removeByKey, renameKeys } from '../utils/utils'

class CompanySettings extends React.PureComponent {
 
  state = {
    last_check_in_time: "11:32 PM",
    selected_time: null,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getCompanySettingsAction())

  }

 
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }

    // handle add department

    _handleAddDepartment = () => {
        const { dispatch, companySettings, currentDepartment } = this.props
        if( currentDepartment && currentDepartment.length){
            dispatch( setCurrentDepartment (''))
            dispatch( setCompanySettingsAction({
                ...companySettings,
                'departments':{
                    ...companySettings.departments,
                    [currentDepartment]:{name:currentDepartment}
                },
            }) )
            dispatch(updateCompanyDepartments({
                ...companySettings.departments,
                [currentDepartment]:{name:currentDepartment}
            }))
        }
        
        else {
            dispatch(setToastMessage("Fields can't  be empty"))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }
    
    _handleClearDepartmentField = () => {
        const { dispatch } = this.props
        dispatch( setCurrentDepartment (''))
    }

    _handleAddDesignation = (department) => {
        const { dispatch, companySettings, currentDesignations } = this.props
        const prevDesignations = companySettings?.departments[department]?.designations || []
        if (currentDesignations
            && Object.keys(currentDesignations).length
            && currentDesignations[department]
            && currentDesignations[department].length) {
            dispatch(updateCompanyDepartments({
                ...companySettings.departments,
                [department]: {
                    name: department,
                    designations: [...prevDesignations, currentDesignations[department]]
                }
            }))
            dispatch(updateCurrentDesignations({ [department]: '' }))
            dispatch(setCompanySettingsAction({
                ...companySettings,
                'departments': {
                    ...companySettings.departments,
                    [department]: {
                        name: department,
                        designations: [...prevDesignations, currentDesignations[department]]
                    }
                },

            }))
        }
        else {
            dispatch(setToastMessage("Fields can't  be empty"))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }


    _handleClearDesignationField = (department) => {
        const { dispatch } = this.props
        dispatch(updateCurrentDesignations ({[department]: '' }))
    }

    _handleDeleteDesignation = (dept, dsg) => {
        const { dispatch, companySettings } = this.props
        let settings = { ...companySettings}
        var index = settings?.departments[dept]?.designations.indexOf(dsg);
        if (index !== -1) {
            var designations = settings?.departments[dept]?.designations
            designations = [ ...designations.slice(0, index),  ...designations.slice(index+1, designations.length)]
            settings = { 
                ...settings,
                "departments":{
                    ...settings?.departments,
                    [dept]:{
                        "name":dept,
                        designations:designations
                    }
                }
            }
            dispatch( setCompanySettingsAction( {...settings}))
        }
    }

    _handleDeleteDepartment = (dept) => {
        const { dispatch, companySettings } = this.props
        var departments = removeByKey(companySettings?.departments, dept)
        let settings = { 
            ...companySettings,
            departments: departments
            }
        dispatch( setCompanySettingsAction( {...settings}))
    }

    _handleEditDepartment = () => {
        console.log('edited :')
    }
    _handleEditDepartmentBtnClick = () => {
        console.log('edit :')
    }

    _handleAddUserBtnClick =() => {
        const { dispatch } = this.props
        dispatch(setCurrentView('add_user'))
    }
  render() {
    const { companySettings, currentDepartment, currentDesignations } = this.props
    const { _handleAddDepartment, _handleClearDepartmentField, _handleAddDesignation, _handleClearDesignationField, _handleDeleteDesignation, _handleDeleteDepartment, _handleEditDepartmentBtnClick,  _handleEditDepartment, _handleAddUserBtnClick } = this
    return (
      <Box width='100%' height='54vh'>
        <Box sx={{py:2}}>
            <Typography
                variant='h4'
            >
                Company Settings
            </Typography>
        </Box>
        
        <Box sx={{ display:'flex',flexDirection:'column', p:5, px:0, gap:5 }}>
            <Box sx={{ display: 'flex',width:'100%',justifyContent:'space-between',alignItems:'flex-start' }}>
                <Typography sx={{
                     ...textStyle, 
                    fontWeight: 600,
                    lineHeight: '160%',
                    letterSpacing: '0.15px',
                    
                    }}>
                    Departments
                </Typography>
                <Button variant="contained" color={"btnBlueAdd"}>Add New Department</Button>
            </Box>
            <Box sx={{ display: 'flex',width:'100%',justifyContent:'space-between',alignItems:'flex-start'}}>
                <Paper sx={{ height:60, width:'100%', display:'flex',  pl:2}} elevation={2}>
                    <StyledTextField action={ setCurrentDepartment } onEnterKeyDown={() => { _handleAddDepartment() }} value={ currentDepartment }  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0,}}/>
                    <Button onClick={ _handleAddDepartment }><CheckCircleIcon color="btnCheck" /></Button>
                    <Button onClick={ _handleClearDepartmentField }><CancelOutlinedIcon color="btnCancel"/></Button>

                </Paper>
                
            </Box> 
            <Box sx={{ display: 'flex',flexDirection:'column',width:'100%',justifyContent:'space-between',alignItems:'flex-start', boxShadow:0 }}>
                { (companySettings && companySettings?.departments && Object.keys(companySettings?.departments).length) && Object.keys(companySettings?.departments).map( d => 
                    <Accordion key={d} sx={{width:'100%'}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Button variant="outlined" color='error' size={'small'} onClick={ () => {  _handleDeleteDepartment(d) } }>Delete</Button>
                            {/* <Button variant="outlined" color='warning' size={'small'} onClick={ () => {  _handleEditDepartmentBtnClick(d) } } sx={{ml: 2}}>Edit</Button> */}
                            <Typography key={d}  sx={{ display:'flex',alignItems:'center', fontSize:'1.2em', ml: 5}}>{ d }</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display:'flex' }}>
                                <Typography>Add Designation</Typography>
                            </Box>
                            <Paper sx={{ height:50, width:'100%', display:'flex' }} elevation={0}>
                                <StyledTextField action={ updateCurrentDesignations } onEnterKeyDown={() => { _handleAddDesignation(d) }} subField={d} value={ currentDesignations[d] ?? '' }  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0}}/>
                                <Button onClick={() => { _handleAddDesignation(d) } }><CheckCircleIcon color="btnCheck" /></Button>
                                <Button onClick={ () => { _handleClearDesignationField(d) } }><CancelOutlinedIcon color="btnCancel"/></Button>
                            </Paper>
                            <Box sx={{gap:0}}>
                                { (companySettings?.departments && Object.keys(companySettings?.departments).length 
                                    && companySettings?.departments[d].designations 
                                    && companySettings?.departments[d].designations.length ) 
                                    ? companySettings?.departments[d].designations
                                    .map(dsg => 
                                        <Box key={dsg} sx={{display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                            <Typography key={dsg} sx={{fontSize:'1em'}}>{ dsg }</Typography>
                                            <Button onClick={ () =>  _handleDeleteDesignation(d,dsg) }><CancelOutlinedIcon color="btnCancel"/></Button>
                                        </Box>)
                                        :''
                                        
                                }
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )
                    
                }
                
            </Box>
        </Box>
        <Box sx={{display:'flex', alignItems:'flex-end', justifyContent:'flex-start',width:'100%'}}>
            <Button onClick={ _handleAddUserBtnClick }  variant="contained" color={"btnSecondaryAdd"} sx={{ width: '20%' }}>Add User</Button>
        </Box>
      </Box>
    )
  }
}

const Department = (props) => {
    const { name } = props 
}

const textStyle = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '20px',
    color: 'rgba(0, 0, 0, 0.87)',
    lineHeight: '160%',
    letterSpacing: '0.15px',
    
}

// Prop Types
CompanySettings.propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    currentAttendanceTab: PropTypes.string,
    isTaskLoading: PropTypes.bool,
    tasks: PropTypes.array,
    selectedStatus: PropTypes.string,
    selectedDate: PropTypes.string,
    sndList: PropTypes.array,
    autocompleteSelectedTask: PropTypes.object,
}

CompanySettings.defaultProps = {
  dispatch: () => null,
  user: {},
  currentAttendanceTab:'Daily',
  isTaskLoading: false,
  tasks: [],
  selectedStatus: '',
  selectedDate: '',
  sndList: [],
  autocompleteSelectedTask: null,
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  attendanceList: state?.attendanceList?.attendanceList,
  employeeList: state?.employeeList?.employeeList,
  currentAttendanceTab: state?.attendanceList?.currentAttendanceTab,
  companyAddressData: state?.admin?.companyAddressData,
  companySettings: state?.admin?.companySettings,
  currentDepartment: state?.companySettings?.currentDepartment,
  currentDesignations: state?.companySettings?.currentDesignations,
  settings: state?.companySettings?.settings,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings)