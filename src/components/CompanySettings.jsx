import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { ClockPicker, TimePicker, DesktopTimePicker, DatePicker, DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

// Import Components
import { Box, Stack, Paper, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Divider } from '@mui/material'
import { Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'
import MapGL from '../components/common/MapGL'
import StyledTextField from '../components/common/StyledTextField'
// Import Actions & Methods
import { stopNotificationSound, sortByDate } from '../utils/utils'
import { attendanceWithAbsenceInfo } from '../utils/attendanceUtils'
import { setFilterOptions, updateFilterOptions, setUniqueDates, setCurrentAttendanceTab } from '../redux/reducers/attendanceReducer'
import { updateCompanyAddressData, updateCompanySettings } from '../redux/reducers/adminReducer'
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'
import { getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"

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


  render() {
    const { dispatch, companySettings } = this.props
    const { last_check_in_time, selected_time } = this.state
    const {  } = this
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
                <Paper sx={{ height:60, width:'100%', display:'flex' }} elevation={2}>
                    <StyledTextField  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none', borderColor: 'transparent', boxShadow:0}}/>
                    <Button><CheckCircleIcon color="btnCheck" /></Button>
                    <Button><CancelOutlinedIcon color="btnCancel"/></Button>

                </Paper>
                
            </Box> 
            <Box sx={{ display: 'flex',flexDirection:'column',width:'100%',justifyContent:'space-between',alignItems:'flex-start' }}>
                <Accordion sx={{width:'100%'}}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                        <Typography  sx={{fontSize:'1.2em'}}>Tech Team</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{gap:0}}>
                            <Typography sx={{fontSize:'1em'}}>Frontend Engineer</Typography>
                            <Typography sx={{fontSize:'1em'}}>Backend Engineer</Typography>

                        </Box>
                        <Typography>Add Designation</Typography>
                        <Paper sx={{ height:50, width:'100%', display:'flex' }} elevation={0}>
                            <StyledTextField  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0}}/>
                            <Button><CheckCircleIcon color="btnCheck" /></Button>
                            <Button><CancelOutlinedIcon color="btnCancel"/></Button>
                        </Paper>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{width:'100%'}}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                         <Typography  sx={{fontSize:'1.2em'}}>Product Team</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{gap:1,pt:0}}>
                                <Typography sx={{fontSize:'1em'}}>Product Manager</Typography>
                        </Box>
                        <Typography>Add Designation</Typography>
                        <Paper sx={{ height:50, width:'100%', display:'flex' }} elevation={0}>
                            <StyledTextField  fieldStyle={{height:'100%', width:'100%',m:0 }} style={{ border:'none',borderBottom:'.5px solid gray', boxShadow:0}}/>
                            <Button><CheckCircleIcon color="btnCheck" /></Button>
                            <Button><CancelOutlinedIcon color="btnCancel"/></Button>
                        </Paper>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
        <Box sx={{display:'flex', alignItems:'flex-end', justifyContent:'flex-start',width:'100%'}}>
            <Button variant="contained" color={"btnSecondaryAdd"} sx={{ width: '10%' }}><Typography sx={{color:"white"}}>Add User</Typography></Button>
        </Box>
        <Stack sx={{mb:3}} spacing={ 1 } direction='row'>

        </Stack>
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

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings)