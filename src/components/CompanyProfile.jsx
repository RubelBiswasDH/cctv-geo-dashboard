import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { ClockPicker, TimePicker, DesktopTimePicker, DatePicker, DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// Import Components
import { Box, Stack, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Divider } from '@mui/material'
import { Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'
import MapGL from '../components/common/MapGL'

// Import Actions & Methods
import { stopNotificationSound, sortByDate } from '../utils/utils'
import { attendanceWithAbsenceInfo } from '../utils/attendanceUtils'
import { setFilterOptions, updateFilterOptions, setUniqueDates, setCurrentAttendanceTab } from '../redux/reducers/attendanceReducer'
import { updateCompanyAddressData, updateCompanySettings } from '../redux/reducers/adminReducer'
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'
import { getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"


import dayjs from 'dayjs'

import { unionArrayOfObjects } from '../utils/utils'
import FilterEmployee from './FilterEmployee'
import StyledTextField from '../components/common/StyledTextField'
import AddressAutoComplete from './common/AddressAutoComplete'

class CompanyProfile extends React.PureComponent {
 
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

  // On Feedback Close
  _onFeedbackClose = () => {
    this.setState({ feedback: null })

    // Stop Notification Sound
    stopNotificationSound()
  }

 
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }

    _handleTimeChange = time => {
        const { dispatch } = this.props
        const { last_check_in_time, selected_time } = this.state
        const pickedTime = time?.$d && dayjs(new Date(time?.$d)).format('h:mm A') || last_check_in_time
        // console.log({pickedTime})
        this.setState({ last_check_in_time: pickedTime ?? pickedTime })
        this.setState({ time: time ?? selected_time })

        // dispatch( getAttendance({start_date: `${selectedDate}`, end_date: `${selectedDate}`}) )
    }

    _updateExactAddress = (updatedAddress) => {
        const { dispatch } = this.props
        const updatedDate = {
            exact_address: updatedAddress.exact_address,
            latitude: updatedAddress.latitude,
            longitude: updatedAddress.longitude
        }
        dispatch(updateCompanyAddressData(updatedDate))
    }
    
    _handleSaveCompanyAddress = (e) => {
        e.preventDefault()
        const { dispatch, companySettings, companyAddressData } = this.props
        if (companyAddressData) {
            const new_settings = {
                companyAddressData: companySettings.companyAddressData
            }
            console.log({ ...companySettings, ...new_settings })
            // dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }))
        }
        else {
            dispatch(setToastMessage('Something went wrong, try again..'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

  render() {
    const { dispatch, isTaskLoading, filterOptions, isDataLoading, currentAttendanceTab, companyAddressData, companySettings } = this.props
    const { feedback, last_check_in_time, selected_time } = this.state
    const { _updateExactAddress, _handleSaveCompanyAddress } = this
    return (
      <Box width='100%' height='54vh'>
        <Box sx={{py:2}}>
            <Typography
                variant='h4'
            >
                Company Profile
            </Typography>
        </Box>
        <FilterEmployee/>
        <Box sx={{ display:'flex', p:5, gap:5 }}>
            <Box sx={{ display:'flex',flexDirection:'column',width:'45%', gap:1,justifyContent:'center',alignItems:'center' }} >
                <StyledTextField action={ updateCompanySettings } field={'company_name'} title={"Company Name : "} value={companySettings?.company_name} fieldStyle={{ width:'100%' }} labelContainerStyle={{width:'40%' }} containerStyle={{ maxHeight: '50px' }}/>
                <Box sx={{ display:'flex',flexDirection:'row',width:'100%' }} >
                    <Typography sx={{ ...textStyle,width:'40%' }}>Company Address : </Typography>
                    <AddressAutoComplete/>
                </Box>
                <Box sx={{ display:'flex',flexDirection:'row',width:'100%'}}>
                    <Typography sx={{ ...textStyle,width:'40%' }}>Last Check In Time : </Typography>
                    <LocalizationProvider dateAdapter={ AdapterDayjs }>
                        <TimePicker
                            // value = { "4:59 PM" }
                            onChange={ this._handleTimeChange }
                            disableMaskedInput={ true }
                            // inputFormat={ 'HH:mm' }
                            renderInput={(params) => (                                            
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField {...params} size={ 'small' } fullWidth={ true } />
                                </Box>                                            
                            
                            )}
                            PopperProps={{
                            placement: 'bottom-start',
                            }}
                            onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
            <Box sx={{ display:'flex',flexDirection:'column',width:'45%', gap:2}}>
                <MapGL
                    markerData={(companySettings && companySettings?.companyAddressData && Object.keys(companySettings?.companyAddressData).length) ? [companySettings?.companyAddressData
                    ] : []
                    }
                    getUpdatedAddress={ _updateExactAddress }
                />
            </Box>
            
                
        </Box>
        <Box sx={{display:'flex', alignItems:'flex-end', justifyContent:'flex-end',width:'100%',pr:30}}>
            <Button onClick={ _handleSaveCompanyAddress } variant="contained" color={"btnSave"} style={{ borderRadius: 2, pt: .5, width: '5%' }}>Save</Button>
        </Box>
        <Stack sx={{mb:3}} spacing={ 1 } direction='row'>

        </Stack>
        
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

const textStyle = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '160%',
    letterSpacing: '0.15px',
    color: 'rgba(0, 0, 0, 0.87)',
}

const FilterField = (props) => {
  const { dispatch, action, value, field, label, fullWidth, sx } = props
  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{...sx}}>
      <TextField
            value={ value } 
            size="small"
            onChange={ 
              e => dispatch(action({ [field]: e.target.value })) } 
            label={label} 
            fullWidth={fullWidth}
            sx = {{fontSize: '.75em'}}
            > 
      </TextField>
    </FormControl>
  )
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
CompanyProfile.propTypes = {
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

CompanyProfile.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfile)