import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, Grid, Typography, TextField, Divider, Button, FormControl, Select, MenuItem } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledButton from './common/StyledBotton'
import image from '../assets/profile-image.jpg'

import {setUserProfileAction} from '../redux/actions/adminActions'
import { updateUserProfile, setProfileEdit } from '../redux/reducers/adminReducer'
import { setCurrentProfileTab } from '../redux/reducers/employeeReducer'
import StyledTextField from './common/StyledTextField'

const GridContent = (props) => {
    const { style, title } = props
    return (
        <Grid xs={12} item sx={{ m: 0, mt: 2, p: 2,gap:1.5, borderRadius: 2, border: "1px solid black", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style }}>
            {(title)
            ?<Typography 
                sx={{
                    fontFamily:'Roboto',
                    fontStyle: 'normal',
                    fontWeight:600,
                    fontSize:'14px',
                    color:'#000000',
                    width:'100%',
                }}>
                {title}
            </Typography>
            :''}
            {props.children}
        </Grid>
    )
}

const ProfileRow = (props) => {
    const {title, value,field, dispatch, profileEdit} = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize:'12px',
    }
    const handleChange = e => {
        e.preventDefault() 
        dispatch(updateUserProfile({[field]: e.target.value}))

    }
    return (
    <Grid xs={12} item container sx={{ border:'none', borderTop:'1px solid pink',pb:0,pt:.5 }}>
        <Grid item xs={5}><Typography sx={{...textStyle, opacity: 0.7, fontWeight:300}}>{title}</Typography></Grid>
        <Grid item xs={7} sx={{p:0}}>{(!profileEdit)?<Typography sx={{...textStyle, fontWeight:600}}>{(value)?value:"-- -- -- -- -- --"}</Typography>
        : <TextField
            hiddenLabel
            fullWidth
            value={(value)?value:""}
            placeholder={title}
            variant="standard"
            size="small"
            sx={{border:'none',outline:'none',m:0,p:0}}
            inputProps={{border:'none',outline:'none',m:0,p:0,pl:.25,

                }}
            InputProps={{border:'none',outline:'none',m:0,p:0,
            disableUnderline: false        
        }}
            onChange={handleChange}      
        />  
      }</Grid>
    </Grid>
    )
}

class Profile extends React.PureComponent {
    render() {
        const { userProfile, profileEdit, dispatch, currentProfileTab, profile, newUser, companySettings} = this.props
        return (
            <Box sx={
                theme => ({
                    padding: {
                        xs: `${theme.spacing(0)}`,
                        md: theme.spacing(0)
                    },
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    ml:'8px'
                }
                )}
            >
                <Box sx={{display:'flex', width:'100%', p:0, m:0 }}>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', background: '#D9D9D9',width:'25%'}}>
                        <Box>
                            <img
                                src={ image }
                                alt='profile'
                                width='100%'
                                height='100%'
                            />    
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                            <Button><Typography>User Profile</Typography></Button>
                            <Button><Typography>Attendance Overview</Typography></Button>
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',width:'75%'}}>
                        <Box sx={{
                            ml:'auto',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent:'flex-start'
                            }}>
                            <TabSwitchButton 
                                value={'PROFILE'} 
                                action={setCurrentProfileTab} 
                                dispatch={dispatch}
                                isActive={ currentProfileTab === 'PROFILE' }
                            />
                            <Divider orientation={'vertical'}></Divider>
                            <TabSwitchButton 
                                value={'OFFICE DETAILS'} 
                                action={setCurrentProfileTab} 
                                dispatch={dispatch} 
                                isActive={ currentProfileTab === 'OFFICE DETAILS' }
                            />
                            <Divider orientation={'vertical'}></Divider>
                            <TabSwitchButton 
                                value={'BANK DETAILS'} 
                                action={setCurrentProfileTab} 
                                dispatch={dispatch} 
                                isActive={ currentProfileTab === 'BANK DETAILS' }
                            />
                            <Divider orientation={'vertical'}></Divider>
                            <TabSwitchButton 
                                value={'EMERGENCY'} 
                                action={setCurrentProfileTab} 
                                dispatch={dispatch} 
                                isActive={ currentProfileTab === 'EMERGENCY' }
                            />
                        </Box>
                        <Box sx={{
                            ml:'auto',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent:'flex-start'
                            }}>  
                            <Box sx={{width:'100%', justifyContent:'space-between',m:3,gap:1}}>
                            { (currentProfileTab === "PROFILE") && <>
                                <Typography sx={{...textStyle,width:'20%', boxShadow:1,mb:2}}>General Information</Typography>
                                <StyledTextField action={ updateUserProfile } title={"Name"} field={"name"} value={userProfile?.name || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Mobile"} field={"mobile"} value={userProfile?.mobile || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Email"} field={"email"} value={userProfile?.email || ''} fieldStyle={{width:'70%'}}/>
                                <Box sx={{display:'flex',p:1,pl:0,gap:1}}>
                                 
                                    <Typography sx={{fontFamily: 'Roboto',fontSize: '18px', fontWeight: 600, width:"16%"}}>Position</Typography>

                                    <FilterField 
                                        filterOptions={Object.keys(companySettings?.departments ) || []}  
                                        dispatch={dispatch} 
                                        field={'profile'} 
                                        subField={'department'}  
                                        value={userProfile?.department} 
                                        fieldStyle={{ width:'50%' }}
                                    />
                                    <FilterField 
                                        filterOptions={companySettings?.departments[userProfile?.department]?.designations || []}  
                                        dispatch={dispatch} 
                                        field={'profile'} 
                                        subField={'designation'}  
                                        value={userProfile?.designation || ''} 
                                        fieldStyle={{ width:'50%' }}
                                    />
                                 
                                </Box>
                                <Typography sx={{...textStyle,width:'20%', boxShadow:1,mb:2}}>Personal Information</Typography>
                                <StyledTextField action={ updateUserProfile } title={"NID"} field={"nid"} value={userProfile?.nid || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"TIN"} field={"tin"} value={userProfile?.tin || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Birth Day"} field={"birth_day"} value={userProfile?.birth_day || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Blood Group"} field={"blood_group"} value={userProfile?.blood_group || ''} fieldStyle={{width:'70%'}}/>
                                </>}
                                { (currentProfileTab === "OFFICE DETAILS") && <>
                                <Typography sx={{...textStyle,width:'20%', boxShadow:1,mb:2}}>Office Information</Typography>
                                <StyledTextField action={ updateUserProfile } title={"Office Email :"} field={"office_email"} value={userProfile?.office_email || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Office Mobile :"} field={"office_mobile"} value={userProfile?.office_mobile || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Job Confirmed : "} field={"job_confirmed"} value={userProfile?.job_confirmed || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Joining Date : "} field={"joining_date"} value={userProfile?.joining_date || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Repoting Person :"} field={"repoting_person"} value={userProfile?.repoting_person || ''} fieldStyle={{width:'70%'}}/>
                                <StyledTextField action={ updateUserProfile } title={"Basic Salary : "} field={"basic_salary"} value={userProfile?.basic_salary || ''} fieldStyle={{width:'70%'}}/>
                                <Typography sx={{...textStyle,width:'20%', boxShadow:1,mb:2}}>Previous Office Information</Typography>
                                <StyledTextField action={ updateUserProfile } title={"Last Working Place :"} field={"last_working_place"} value={userProfile?.last_working_place || ''} fieldStyle={{width:'70%'}}/>
                                
                                </>}
                            </Box>  
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

const FilterField = (props) => {
    const { dispatch, action, value, field, subField, filterOptions, title, fieldStyle, fullWidth, sx } = props
    const handleChange = e => {
      e.preventDefault()
      if (field === 'profile') {
          dispatch(updateUserProfile({
              [subField]: e.target.value
          }))
      }
      else {
          dispatch(updateUserProfile({ [field]: e.target.value }))
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
const textStyle = {

    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '166%',
    letterSpacing:' 0.4px',
    color: 'rgba(0, 0, 0, 0.87)',
}
// Prop Types
ProfileRow.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    dispatch: PropTypes.func
}

ProfileRow.defaultProps = {
    title: "Title",
    value: "",
    dispatch: () => null
}


GridContent.propTypes = {
    style: PropTypes.object
}

GridContent.defaultProps = {
    style: {}
}

Profile.propTypes = {
    userProfile:PropTypes.array,
    profileEdit:PropTypes.bool
}

Profile.defaultProps = {
    userProfile:{},
    profileEdit:false
}

const mapStateToProps = state => ({
    userProfile: state?.admin?.userProfile,
    profileEdit: state?.admin?.profileEdit,
    currentProfileTab: state?.employeeList?.currentProfileTab,
    profile: state?.employeeList?.profile,
    userProfile: state?.admin?.userProfile,
    companySettings: state?.admin?.companySettings,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)