import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// Import Components
import { Box, Button, Typography, TextField } from '@mui/material'
import MapGL from '../components/common/MapGL'

// Import Actions & Methods
import { updateCompanyAddressData, updateCompanySettings, setCompanySettings, setFallbackComapanyAddress } from '../redux/reducers/adminReducer'
import { getAttendance }  from '../redux/actions/attendanceActions'
import { setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"

import { getReverseGeoAddress } from '../utils/utils'

import dayjs from 'dayjs'

import FilterEmployee from './FilterEmployee'
import StyledTextField from '../components/common/StyledTextField'
import AddressAutoComplete from './common/AddressAutoComplete'
import TimeKeeper from 'react-timekeeper';

// import { TimePicker, LocalizationProvider, LoadingButton } from '@mui/lab'

import TimeField from 'react-simple-timefield';

class CompanyProfile extends React.PureComponent {
 
  state = {
    last_check_in_time: "11:32 PM",
    selected_time: null,
    time: "12:30am"
  }
 
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }

    _handleTimeChange = time => {
        const { last_check_in_time, selected_time } = this.state
        const pickedTime = time?.$d && (dayjs(new Date(time?.$d)).format('h:mm A') || last_check_in_time)
        this.setState({ last_check_in_time: pickedTime ?? pickedTime })
        this.setState({ time: time ?? selected_time })
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
        const { dispatch, companySettings, companyAddressData, isNewUser, fallbackComapanyAddress } = this.props
        if(fallbackComapanyAddress){
          const new_settings = {
            companyAddressData: {exact_address:fallbackComapanyAddress}
        }
          dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }, isNewUser))
        }
        else if (companyAddressData) {
            const new_settings = {
                companyAddressData: companySettings.companyAddressData
            }
            dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }, isNewUser))
        }
        else {
            dispatch(setToastMessage('Something went wrong, try again..'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    _handleReverseGeo = (e) => {
      const { dispatch } = this.props
      const {lngLat} = e
      getReverseGeoAddress({ longitude: lngLat.lng, latitude: lngLat.lat })
      .then(res => {
        const reverseData = res.place
        if(reverseData) {
          // Get Updated Address from Reverse Geo Code
          const updatedAddress = {
            exact_address: reverseData.address,
            longitude: lngLat.lng,
            latitude: lngLat.lat 
          }
          dispatch(setFallbackComapanyAddress(''))
          dispatch(setCompanySettings({...this.props.companySettings, ...{companyAddressData:updatedAddress}}))
        }
      })
      .catch(err => {
        console.error(err)
      })
  
    }
  render() {
    const { dispatch, companySettings } = this.props
    const { _updateExactAddress, _handleSaveCompanyAddress, _handleReverseGeo } = this
    return (
      <Box width='100%' height='54vh'>
        <Box sx={{py:2}}>
            <Typography
                variant='h4'
            >
                Company Profile
            </Typography>
        </Box>
        <FilterEmployee disabled={true}/>
        <Box sx={{ display:'flex', p:1, gap:5 }}>
            <Box sx={{ display:'flex',flexDirection:'column',width:'45%', gap:1,justifyContent:'center',alignItems:'center' }} >
                <StyledTextField action={ updateCompanySettings } field={'name'} title={"Company Name : "} value={companySettings?.name} fieldStyle={{ width:'60%' }} titleStyle={{ fontSize: {xs:'12px',sm:'14px',md:'16px',lg:'20px'} }} titleContainerStyle={{width:'40%' }} containerStyle={{ maxHeight: '50px' }}/>
                <Box sx={{ display:'flex',flexDirection:'row',width:'100%',mb:1.5 }} >
                    <Typography sx={{ ...textStyle,width:'40%' }}>Company Address : </Typography>
                    <Box sx={{width: '60%'}}>
                      <AddressAutoComplete />
                    </Box>
                    
                </Box>
                <Box sx={{ display:'flex',flexDirection:'row',width:'100%'}}>
                    <Typography sx={{ ...textStyle,width:'40%' }}>Set Late Time (24h) : </Typography>
                    {/* <TimeKeeper
                      time={companySettings?.late_time}
                      onChange={ (newTime) => {
                        dispatch(updateCompanySettings({late_time:newTime.formatted24}))
                      }}
                      hour24Mode
                    /> */}
                    <TimeField
                      input={<TextField  size={'small'} sx={{width:'60%'}}/>}
                      value={companySettings?.late_time} 
                      onChange={(event, time) => {
                        dispatch(updateCompanySettings({late_time:time}))
                      }
                    }
                  />
                </Box> 
                <Box>
                
                </Box>
                <Box  sx={{ display:'flex',flexDirection:'row',width:'100%'}}>
                  <Typography>*Any employee reach after this time will considered as <span style={{color:'red'}}>'Late'</span> </Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'flex-end',width:'100%' }}>
                  <Button onClick={ _handleSaveCompanyAddress } variant="contained" color={"btnSave"} style={{ borderRadius: 2, pt: .5, width: '15%' }}>Save</Button>
                </Box> 
            </Box>
            <Box sx={{ display:'flex',flexDirection:'column',width:'45%', gap:2}}>
                <MapGL
                    markerData={(companySettings && companySettings?.companyAddressData && Object.keys(companySettings?.companyAddressData).length && companySettings?.companyAddressData?.latitude) ? [companySettings?.companyAddressData
                    ] : []
                    }
                    getUpdatedAddress={ _updateExactAddress }
                    _handleReverseGeo = { _handleReverseGeo }
                />

            </Box>
  
        </Box>

      </Box>
    )
  }
}

const textStyle = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: {xs:'12px',sm:'14px',md:'16px',lg:'20px'},
    lineHeight: '160%',
    letterSpacing: '0.15px',
    color: 'rgba(0, 0, 0, 0.87)',
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
    isNewUser: PropTypes.bool
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
  isNewUser: false
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  attendanceList: state?.attendanceList?.attendanceList,
  employeeList: state?.employeeList?.employeeList,
  currentAttendanceTab: state?.attendanceList?.currentAttendanceTab,
  companyAddressData: state?.admin?.companyAddressData,
  companySettings: state?.admin?.companySettings,
  isNewUser: state?.dashboard?.isNewUser ?? false,
  fallbackComapanyAddress: state?.admin?.fallbackComapanyAddress ?? ''
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfile)