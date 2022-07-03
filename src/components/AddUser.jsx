import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import downloadDemoCSV from '../assets/demo_users.xlsx'

// Import Components
import { Paper, Grid, InputBase, InputLabel, Select, Box, Button, FormControl, MenuItem, Typography } from '@mui/material'
import CustomStepper from './Stepper'
import StyledDropdown from './common/StyledDropdown'
import AddressAutoComplete from './common/AddressAutoComplete_2'
import StyledDatePicker from './common/StyledDatePicker'

import { createUser, createBulkUser } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"
// Import Actions & Methods

import { getCompanyList } from '../redux/actions/registerActions'

import { setFilterOptions } from '../redux/reducers/attendanceReducer'
import { updateNewUser, updateNewUserProfile, setFileInput, setAddUserDetails } from '../redux/reducers/adminReducer'

class AddUser extends React.PureComponent {

  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
  }

   _handleSaveUser = e => {
    const { dispatch, newUser } = this.props
    if (newUser.name && newUser.phone && newUser.email && newUser?.profile?.department && newUser?.profile?.designation) {
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
        const { dispatch, newUser, addUserDetails } = this.props
        if (newUser.name && newUser.phone && newUser.email && newUser?.profile?.department && newUser?.profile?.designation) {
            dispatch(setAddUserDetails(!addUserDetails))
        }
        else{
            dispatch(setToastMessage('Please fill all Basic Informations fields before move to adding details !'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    _handleSkipDetails = () => {
        const { dispatch, addUserDetails } = this.props
        dispatch(setAddUserDetails(!addUserDetails))
    }

    _handleAutoCompInputChange = e => {
        const { dispatch } = this.props
        dispatch(getCompanyList(e.target.value))
    }

    // handleAutoCompChange
    _handleAutoCompChange = (e, value) => {
        const { dispatch } = this.props
        dispatch(updateNewUserProfile({
            'house_address': value?.Address ?? ''
        }))
    }
    _handleFileUpload = e => {
        e.preventDefault()
        const { dispatch, fileInput } = this.props
        const formData = new FormData();
        formData.append("users", fileInput)
        dispatch(createBulkUser(formData))
    }

    _handleFileInput = e => {
        const { dispatch } = this.props
        e.preventDefault()
        let file = e.target.files[0]
        const formData = new FormData()
        formData.append("users", file)
        dispatch(createBulkUser(formData))
        file = null
        formData.users = null
        document.getElementById('fileInput').value='';
        // dispatch(setFileInput(file))
    }


  render() {
    const { dispatch, newUser, companySettings, companyNameOptions, addUserDetails } = this.props
    const { _handleSaveUser, _handleAddDetails, _handleSkipDetails, _handleAutoCompInputChange, _handleAutoCompChange, _handleFileUpload, _handleFileInput } = this
    return (
      <Box width='100%' height='54vh'>
        <Box sx={{display:'flex',py:2,pb:5, justifyContent:'space-between'}}>
            <Typography
                variant='h4'
            >
                Add New User
            </Typography>
            { addUserDetails && <Button variant='contained' color='warning' onClick={ _handleSkipDetails }><Typography>Back to Basic Informations</Typography></Button>}
        </Box>
        <Box sx={{ display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'flex-start',width:'70%', ml:4,mb:2, px:1, pb:2,gap:3, boxShadow:2}}>
            <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 400,
                        fontSize: '24px'
                    }}
            >
                    Import Multiple Employee
            </Typography>
            <Typography
                    variant='body2'
                    sx={{fontWeight: 400, fontSize: '14px'}}
                >
                    Import the dummy csv file and change it according to your employees credentials. Click here to download 
                    <Button href={downloadDemoCSV} onClick={() => null} variant='text'>DEMO CSV</Button>
            </Typography>
            
             <Box sx={{display:'flex', width:'100%',gap:2}}>
                <InputButton onChange={_handleFileInput}></InputButton>
                {/* <Button onClick={_handleFileUpload} variant="outlined" style={{ ml:2,pt: .5, width: '10%' }}>Submit</Button> */}

            </Box>
        </Box>
        { !addUserDetails && <>
            <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%', pl:5,gap:3}}>
                <Grid xs={12} item sx={{display:'flex', gap:0, pb:0, width:'100%',alignItems:'flex-start', justifyContent: 'flex-start' }}>
                    <Typography 
                        sx={{ fontWeight:600 }}
                        variant='h5'
                    >
                        Basic Informations
                    </Typography>
                </Grid>
                <UserField required={true} dispatch={dispatch} field={'name'}  title={"Name : "} value={newUser?.name} fieldStyle={{ width:'40%' }}/>
                <UserField required={true} dispatch={dispatch} field={'email'}  title={"Email : "} value={newUser?.email} fieldStyle={{ width:'40%' }}/>
                <UserField required={true} dispatch={dispatch} field={'phone'}  title={"Phone : "} value={newUser?.phone} fieldStyle={{ width:'40%' }}/>
                <FilterField 
                    filterOptions={
                        ((companySettings 
                        && Object.keys(companySettings).length 
                        && companySettings?.departments) 
                        && Object.keys(companySettings?.departments )) || []}  
                    dispatch={dispatch} 
                    field={'profile'} 
                    subField={'department'} 
                    required={true} 
                    title={"Department : "} 
                    value={newUser?.profile?.department || ''} 
                    fieldStyle={{ width:'25%' }}
                />
                <FilterField 
                    filterOptions={(
                        (companySettings 
                        && Object.keys(companySettings).length 
                        && companySettings?.departments)  
                        && companySettings?.departments[newUser?.profile?.department]?.designations) || []}  
                    dispatch={dispatch} 
                    field={'profile'} 
                    subField={'designation'}
                    required={true}  
                    title={"Designation : "} 
                    value={newUser?.profile?.designation || ''} 
                    fieldStyle={{ width:'25%' }}
                />
            </Box>
            <Box sx={{display:'flex', flexDirection:'row',justifyContent:'flex-end', alignItems:'center',width:'60%', pr:5,mt:3,gap:3}}>
                <Button variant='contained' color='warning' onClick={ _handleAddDetails }><Typography>Add Details</Typography></Button>
                <Button variant='contained' color='success'  onClick={ _handleSaveUser }><Typography>Add User</Typography></Button>
            </Box>
        </>}
        { addUserDetails && 
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
                steps = {['Personal Info', 'Official Info', 'Bank Account', 'Emergency Contact']} 
                contents = {formSteps(dispatch, newUser, companyNameOptions, _handleAutoCompInputChange, _handleAutoCompChange)}
                handleSubmit = {_handleSaveUser}
                />
            </Box>
        </Box>
        }
      </Box>
     
    )
  }
}

const formSteps = (dispatch, newUser, addressFilterOptions, _handleAutoCompInputChange, _handleAutoCompChange) => {
    return ([
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1 }}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'nid'}  title={"NID"} value={newUser?.profile?.nid} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'tin'}  title={"Tin"} value={newUser?.profile?.tin} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <AddressAutoComplete
                _handleAutoCompInputChange = { _handleAutoCompInputChange }
                _handleAutoCompChange = { _handleAutoCompChange }
                filterOptions = { addressFilterOptions }
                value={ newUser?.profile?.house_address } 
                title={"House Address"} 
                titleStyle={{ fontFamily: 'Roboto'}} 
                fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
            />
            <StyledDatePicker
                field={'profile'}
                subField={'birth_day'}  
                title={"Birth Date"} 
                titleStyle={{ fontFamily: 'Roboto',fontSize: '18px'}} 
                value={newUser?.profile?.birth_day}
                dispatch={ dispatch }
                action={ updateNewUserProfile }
                fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
            />
            <StyledDropdown 
                filterOptions={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                field={'profile'} 
                subField={'blood_group'}  
                title={"Blood Group"} 
                value={newUser?.profile?.blood_group || ''}
                action={ updateNewUserProfile }
                fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
            />
            <StyledDropdown 
                filterOptions={['Male', 'Female', 'Other']}
                field={'profile'} 
                subField={'gender'}  
                title={"Gender"} 
                value={newUser?.profile?.gender || ''}
                action={ updateNewUserProfile }
                fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
            />
        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'office_email'}  title={"Office Email"} value={newUser?.profile?.office_email} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'office_mobile'}  title={"Office Phone No"} value={newUser?.profile?.office_mobile} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/> 
            <StyledDatePicker
                field={'profile'}
                subField={'joining_date'}  
                title={"Joining Date"} 
                titleStyle={{ fontFamily: 'Roboto',fontSize: '18px'}} 
                value={newUser?.profile?.joining_date}
                dispatch={ dispatch }
                action={ updateNewUserProfile }
                fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
            />
            <UserField  dispatch={dispatch} field={'profile'} subField={'reporting_person'}  title={"Reporting Person"} value={newUser?.profile?.reporting_person} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'basic_salary'}  title={"Gross Salary"} value={newUser?.profile?.basic_salary} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'account_title'}  title={"Account Title"} value={newUser?.profile?.account_title} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'account_number'}  title={"Account No"} value={newUser?.profile?.account_number} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'bank_name'}  title={"Bank Name"} value={newUser?.profile?.bank_name} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'branch_name'}  title={"Branch Name"} value={newUser?.profile?.branch_name} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'routing_number'}  title={"Routing No"} value={newUser?.profile?.routing_number} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>

        </Box>,
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%',gap:1}}>
            <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person'}  title={"Contact Person"} value={newUser?.profile?.contact_person} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'emergency_mobile_number'}  title={"Mobile Number"} value={newUser?.profile?.emergency_mobile_number} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'relationship'}  title={"Relationship"} value={newUser?.profile?.relationship} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
            <UserField  dispatch={dispatch} field={'profile'} subField={'last_working_place'}  title={"Last Working Place"} value={newUser?.profile?.last_working_place} fieldStyle={{ width:{xs:'55%', lg:'60%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
        </Box>
     
    ])
}

// field to add user information

const UserField = (props) => {
    const { title, label, value, field, subField, dispatch, style, fieldStyle, required, titleStyle, titleContainerStyle } = props
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
            { title && 
            <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle}}>
                <Typography variant='h6' sx={{ fontWeight:600, fontSize:{xs:'16px', md:'18px', lg:'20px'}, ...textStyle, ...titleStyle }}>{title}</Typography>
            </Box>
            }
            <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start', width:'50%', ...fieldStyle }}>
                <FormControl
                    required={required}
                    xs={12}
                    sx={{display:'flex',flexDirection:'column', p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white', color: '#000000',width:'100%', border: '.5px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px', ...style }}
                >   
                    <InputLabel sx={{display:'flex',width:'100%',transform: 'translate(8px, -8px) scale(1)'}} required={required}>{label}</InputLabel>
                    <InputBase
                        sx={{ m: 0, p:0, ml:3, flex: 1, color: '#000000', opacity: 1, width:'100%', }}
                        inputProps={{padding:0, 'aria-label': { title }, color: '#000000' }}
                        value={value || ''}
                        onChange={ handleChange }
                        required={required}
                    />
                </FormControl>
            </Box>
        </Grid>
    )
}


const FilterField = (props) => {
  const { dispatch, value, field, subField, filterOptions, required, label, title, fieldStyle } = props
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
    fontSize:{xs:'12px',sm:'14px', md:'16px', lg:'20px'}
}
  return (
    <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
            <Typography variant='h6' sx={{ fontWeight:600, fontSize:{xs:'16px', md:'18px', lg:'20px'}, ...textStyle}}>{title}</Typography>
        </Box>
        <FormControl required={required} fullWidth={false} sx={{p:0,m:0,width:'30%', ...fieldStyle}} size="small">
            <InputLabel sx={{display:'flex',width:'100%', transform: 'translate(8px, -8px) scale(1)'}} required={required}>{label}</InputLabel>
            <Select
                required={required}
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

//file input button

const InputButton = (props) => {
    const { sx, onChange } = props
    const fileInput = React.createRef()
    var title = (fileInput?.current && fileInput.current.files?.length > 0)?fileInput.current?.files[0]?.name:"IMPORT"

    if(fileInput?.current && fileInput.current.files.length > 0){
        // console.log(fileInput.current.files.length > 0)
        // console.log({file: fileInput.current?.files[0]?.name})
    }
    
    return (
        <Paper
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border:'1.5px solid black', ...sx }}
        >
            <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ display: 'flex',gap:1, alignItems: 'center', justifyContent: 'center',textTransform: 'none',width:'100%'}}
                onClick={() => fileInput.current.click()}
            >
                <Typography
                    sx={{
                        color: 'white',
                        fontSize: '.8em',
                        pl: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: "14px",
                        fontWeight: 600,
                        flex: 1,
                        color: 'white',
                        opacity: 1,
                        borderRadius: 2
                    }}>
                    {title}
                </Typography>
            </Button>
            <input
                id='fileInput'
                ref={fileInput}
                type="file"
                style={{ display: 'none' }}
                onChange={onChange}
            />
        </Paper>
    );
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
  companySettings: state?.admin?.companySettings,
  companyNameOptions: state?.register?.companyNameOptions ?? [],
  fileInput: state?.admin?.fileInput,
  addUserDetails: state?.admin?.addUserDetails ?? false
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)