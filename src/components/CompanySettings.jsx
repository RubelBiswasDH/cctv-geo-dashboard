import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { ClockPicker, TimePicker, DesktopTimePicker, DatePicker, DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// Import Components
import { Box, Paper, Button, Typography } from '@mui/material'
import StyledTextField from '../components/common/StyledTextField'
// Import Actions & Methods

import { updateCompanyDepartments } from '../redux/reducers/adminReducer'
import { getAttendance }  from '../redux/actions/attendanceActions'
import { getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'

import { setCurrentDepartment, setCurrentDesignation } from "../redux/reducers/companySettingsReducer"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import dayjs from 'dayjs'



class CompanySettings extends React.PureComponent {
 
  state = {
    last_check_in_time: "11:32 PM",
    selected_time: null,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getCompanySettingsAction())
    let date = new Date()
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    const selected_date = dayjs(new Date()).format('YYYY-MM-DD')
    const attendanceList = this.props.attendanceList
    const employeeList = this.props.employeeList
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
        // dispatch( updateDepartments({
        //     [currentDepartment]:{name:currentDepartment}
        // }) )
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
    _handleClearDepartmentField = () => {
        const { dispatch } = this.props
        dispatch( setCurrentDepartment (''))
    }
    _handleAddDesignation = (department) => {
        console.log(department)
        const { dispatch, companySettings, currentDepartment, currentDesignation, settings} = this.props
        // const prevDesignations = settings?.departments[department]?.designations || []
        const prevDesignations = companySettings?.departments[department]?.designations || []

        dispatch(updateCompanyDepartments({
            ...companySettings.departments,
            [department]:{ 
                name: department,
                designations:[ ...prevDesignations, currentDesignation]
            }
        }))
        dispatch( setCurrentDesignation (''))
        dispatch( setCompanySettingsAction({
            ...companySettings,
            'departments':{
                ...companySettings.departments,
                [department]:{ 
                    name: department,
                    designations:[ ...prevDesignations, currentDesignation]
                }
            },
            
        }) )
    }


    _handleClearDesignationField = () => {
        const { dispatch } = this.props
        dispatch(setCurrentDesignation (''))
    }
  render() {
    const { dispatch, companySettings, currentDepartment, currentDesignation, settings } = this.props
    const departments = companySettings?.departments
    // Object.keys(departments).map( d => {console.log(departments[d])})
    const { last_check_in_time, selected_time } = this.state
    const { _handleAddDepartment, _handleClearDepartmentField, _handleAddDesignation, _handleClearDesignationField } = this
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
                    <StyledTextField action={ setCurrentDepartment } value={ currentDepartment }  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0,}}/>
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
                            <Typography key={d}  sx={{fontSize:'1.2em'}}>{ d }</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Add Designation</Typography>
                            <Paper sx={{ height:50, width:'100%', display:'flex' }} elevation={0}>
                                <StyledTextField action={ setCurrentDesignation } value={ currentDesignation }  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0}}/>
                                <Button onClick={() => { _handleAddDesignation(d) } }><CheckCircleIcon color="btnCheck" /></Button>
                                <Button onClick={ _handleClearDesignationField }><CancelOutlinedIcon color="btnCancel"/></Button>
                            </Paper>
                            <Box sx={{gap:0}}>
                                { (companySettings?.departments && Object.keys(companySettings?.departments).length 
                                    && companySettings?.departments[d].designations 
                                    && companySettings?.departments[d].designations.length ) 
                                    && companySettings?.departments[d].designations.map(d => <Typography key={d} sx={{fontSize:'1em'}}>{ d }</Typography>)
                                    
                                }
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )
                    
                }
                
            </Box>
        </Box>
        <Box sx={{display:'flex', alignItems:'flex-end', justifyContent:'flex-start',width:'100%'}}>
            <Button variant="contained" color={"btnSecondaryAdd"} sx={{ width: '20%' }}>Add User</Button>
        </Box>
      </Box>
    )
  }
}

const textStyle = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '20px',
    color: 'rgba(0, 0, 0, 0.87)',
    lineHeight: '160%',
    letterSpacing: '0.15px',
    
}

const TabSwitchButton = (props) => {
    const { value, dispatch, action, isActive } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
        /* identical to box height, or 171% */
        textAlign: 'center',
        letterSpacing:' 0.4px',
        textTransform: 'uppercase',
        /* Light/Primary/Main */
        color:'rgba(0, 0, 0, 0.38)',
        px:2,
        borderBottom: '2px solid transparent'
    }
    const activeBtnStyle = isActive?{
        color: '#007AFF',
        borderBottom: '2px solid #007AFF'
    }:
    {}
    const handleClick = () => {
        dispatch(action(value))
    }
    return (
        <Button onClick={handleClick} variant="text"><Typography sx={{ ...textStyle, ...activeBtnStyle }}>{value}</Typography></Button>
    )
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
  currentDesignation: state?.companySettings?.currentDesignation,
  settings: state?.companySettings?.settings,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings)