import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { DatePicker, DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// Import Components
import { Grid, Paper, InputBase, Box, Stack, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Divider } from '@mui/material'
import CustomStepper from './Stepper'
import { createUser } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"
// Import Actions & Methods
import { setFilterOptions } from '../redux/reducers/attendanceReducer'
import { updateNewUser, updateNewUserProfile } from '../redux/reducers/adminReducer'

class AddUser extends React.PureComponent {
 
  state = {
    add_details:false
  }

  componentDidMount() {
    const { dispatch } = this.props

  }

  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
  }

   _handleSaveUser = e => {
    const { dispatch, newUser } = this.props
    if (newUser.name && newUser.phone && newUser.email && newUser?.profile?.departments && newUser?.profile?.departments) {
        if(newUser.profile && Object.keys(newUser.profile).length ){
            const detailUser = {
                ...newUser,
                profile: JSON.stringify(newUser.profile)
            }
            dispatch(createUser(detailUser))
        }
        else{
            dispatch(createUser(newUser))
        }
    }
    else {
        dispatch(setToastMessage('All fields are mandatory'))
        dispatch(setToastIsOpen(true))
        dispatch(setToastSeverity('warning'))
    }
    } 

    _handleAddDetails = () => {
        this.setState(state => ({add_details:!state.add_details}))
    }
  render() {
    const { dispatch, newUser, companySettings } = this.props
    const { _handleSaveUser, _handleAddDetails } = this
    const { add_details } = this.state
    return (
      <Box width='100%' height='54vh'>
        <Box sx={{py:2,pb:5}}>
            <Typography
                variant='h4'
            >
                Add New User
            </Typography>
        </Box>
        { !add_details && <>
            <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%', pl:5,gap:3}}>
                <UserField  dispatch={dispatch} field={'name'}  title={"Name : "} value={newUser?.name} fieldStyle={{ width:'40%' }}/>
                <UserField  dispatch={dispatch} field={'email'}  title={"E: Mail : "} value={newUser?.email} fieldStyle={{ width:'40%' }}/>
                <UserField  dispatch={dispatch} field={'phone'}  title={"Phone : "} value={newUser?.phone} fieldStyle={{ width:'40%' }}/>
                <FilterField 
                    filterOptions={Object.keys(companySettings?.departments ) || []}  
                    dispatch={dispatch} 
                    field={'profile'} 
                    subField={'department'}  
                    title={"Department : "} 
                    value={newUser?.profile?.department || ''} 
                    fieldStyle={{ width:'25%' }}
                />
                <FilterField 
                    filterOptions={companySettings?.departments[newUser?.profile?.department]?.designations || []}  
                    dispatch={dispatch} 
                    field={'profile'} 
                    subField={'designation'}  
                    title={"Designation : "} 
                    value={newUser?.profile?.designation || ''} 
                    fieldStyle={{ width:'25%' }}
                />
                {/*
                    department filters
                    || Object.keys(companySettings?.departments)[0] 
                    designations filters
                    || companySettings?.departments[newUser?.profile?.department]?.designations[0] 
                    || companySettings?.departments[Object.keys(companySettings?.departments)[0]]?.designations[0] */}
            </Box>
            <Box sx={{display:'flex', flexDirection:'row',justifyContent:'flex-end', alignItems:'center',width:'60%', pr:5,mt:3,gap:3}}>
                <Button variant='contained' color='warning' onClick={ _handleAddDetails }><Typography>Add Details</Typography></Button>
                <Button variant='contained' color='success'  onClick={ _handleSaveUser }><Typography>Add User</Typography></Button>
            </Box>
        </>}
        { add_details && 
            <Box>
                {/* <Button variant='contained' color='warning' onClick={ _handleAddDetails }><Typography>Continue with Minimal Information</Typography></Button> */}
            <Box 
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    p:5, 
                    boxShadow: '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
                    bordeRadius: '4px',
                    gap:2
                    }}>
            <CustomStepper 
                steps = {['Personal Info', 'Official Info', 'Bank Account', 'Contact']} 
                contents = {formSteps(dispatch, newUser)}
                handleSubmit = {_handleSaveUser}
                />
            </Box>
        </Box>
        }
      </Box>
     
    )
  }
}

const formSteps = (dispatch, newUser) => {
    return ([
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1 }}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'nid'}  title={"NID"} value={newUser?.profile?.nid} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'tin'}  title={"Tin"} value={newUser?.profile?.tin} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'house_address'}  title={"House Address"} value={newUser?.profile?.house_address} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'birth_date'}  title={"Birth Date"} value={newUser?.profile?.birth_date} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'blood_group'}  title={"Blood Group"} value={newUser?.profile?.blood_group} fieldStyle={{ width:'50%' }}/>
        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'office_email'}  title={"Office Email"} value={newUser?.profile?.office_email} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'office_phone_no'}  title={"Office Phone No"} value={newUser?.profile?.office_phone_no} fieldStyle={{ width:'50%' }}/> 
            <UserField  dispatch={dispatch} field={'profile'} subField={'reporting_person'}  title={"Reporting Person"} value={newUser?.profile?.reporting_person} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'joining_data'}  title={"Joining Date"} value={newUser?.profile?.joining_data} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'reporting_person'}  title={"Reporting Person"} value={newUser?.profile?.reporting_person} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'basic_salary'}  title={"Basic Salary"} value={newUser?.profile?.basic_salary} fieldStyle={{ width:'50%' }}/>
        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'account_title'}  title={"Account Title"} value={newUser?.profile?.account_title} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'account_no'}  title={"Account No"} value={newUser?.profile?.account_no} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'bank_name'}  title={"Bank Name"} value={newUser?.profile?.bank_name} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'branch_name'}  title={"Branch Name"} value={newUser?.profile?.branch_name} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'routing_no'}  title={"Routing No"} value={newUser?.profile?.routing_no} fieldStyle={{ width:'50%' }}/>

        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person'}  title={"Contact Person"} value={newUser?.profile?.contact_person} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person_no'}  title={"Mobile Number"} value={newUser?.profile?.contact_person_no} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'relationship_with_contact_perso'}  title={"Relationship"} value={newUser?.profile?.relationship_with_contact_perso} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'last_working_place'}  title={"Last Working Place"} value={newUser?.profile?.last_working_place} fieldStyle={{ width:'50%' }}/>
        </Box>
     
    ])
}

// field to add user information

const UserField = (props) => {
    const { title, value, field, subField, dispatch, style, fieldStyle, titleStyle } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize: '18px',
    }
    const handleChange = e => {
        e.preventDefault()
        if (field === 'profile') {
            dispatch(updateNewUserProfile({
                [subField]: e.target.value
            }))
        }
        else {
            dispatch(updateNewUser({ [field]: e.target.value }))
        }

    }
    return (
        <Grid xs={12} item sx={{display:'flex', gap:0, pb:0, width:'100%',alignItems:'flex-start', justifyContent: 'flex-start' }}>
            <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
                <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
            </Box>
            <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start', width:'50%', ...fieldStyle }}>
                <Paper
                    xs={12}
                    sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000',width:'100%', border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px', ...style }}
                >   
                    
                    <InputBase
                        sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1 }}
                        inputProps={{ 'aria-label': { title }, color: '#000000' }}
                        value={value || ''}
                        onChange={ handleChange }
                    />
                </Paper>
            </Box>
        </Grid>
    )
}


const FilterField = (props) => {
  const { dispatch, action, value, field, subField, filterOptions, title, fieldStyle, fullWidth, sx } = props
  const handleChange = e => {
    e.preventDefault()
    if (field === 'profile') {
        dispatch(updateNewUserProfile({
            [subField]: e.target.value
        }))
    }
    else {
        dispatch(updateNewUser({ [field]: e.target.value }))
    }

}
const textStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
}
  return (
    <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
            <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
        </Box>
        <FormControl fullWidth={false} sx={{p:0,m:0,width:'30%', ...fieldStyle}} size="small">
                {/* <InputLabel id="demo-simple-select-label">''</InputLabel> */}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value= { value ?? filterOptions[0] }
                    label=""
                    onChange={handleChange}
                    sx = {{fontSize: '.75em'}}
                >    
                    {filterOptions.map(d => (<MenuItem key={d} value={d}>{d}</MenuItem>))}            
                </Select>
            </FormControl>
    </Grid>
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
AddUser.propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    newUser: PropTypes.object,

}

AddUser.defaultProps = {
  dispatch: () => null,
  user: {},
  newUser: {
    profile:{}
  },
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  newUser: state?.admin?.newUser,
  companySettings: state?.admin?.companySettings
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)