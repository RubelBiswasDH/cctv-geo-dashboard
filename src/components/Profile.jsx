import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, Grid, Typography, TextField, Divider, Button } from '@mui/material'
import image from '../assets/profile-image.jpg'

import {setUserProfileAction} from '../redux/actions/adminActions'
import { updateUserProfile, setProfileEdit } from '../redux/reducers/adminReducer'
import { setCurrentProfileTab } from '../redux/reducers/employeeReducer'
import StyledTextField from './common/StyledTextField'
import StyledDropdown from './common/StyledDropdown'
import StyledDatePicker from './common/StyledDatePicker'

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
    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch(setCurrentProfileTab('PROFILE'))
    }
    render() {
        const { userProfile, profileEdit, dispatch, currentProfileTab, companySettings} = this.props
        const disabled = !profileEdit
        return (
            <Box sx={
                theme => ({
                    padding: {
                        xs: `${theme.spacing(0)}`,
                        md: theme.spacing(0)
                    },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    ml:'8px',
                    height:'80vh',
                    flexDirection:'column'
                }
                )}
            >
                <Box sx={{display:'flex', width:'100%', height:'90%', p:0, m:0 }}>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', background: '#D9D9D9',width:'25%', height:'100%'}}>
                        <Box>
                            <img
                                src={ image }
                                alt='profile'
                                width='100%'
                                height='100%'
                            />    
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%',pt:2, pl:2}}>
                            <Box sx={{width:'100%', background: "#A5A6F6"}}><Button><Typography sx={{textTransform:'none',color:'#000',fontSize:'1.5em', fontWeight:600}}>User Profile</Typography></Button></Box>
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',width:'75%', height:'100%'}}>
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
                            { (currentProfileTab === "PROFILE") && 
                            <Box sx={{ ...tabContent }}>
                                <Box sx={{display:'flex', width:{xs:'85%', lg:'95%'}}}>
                                    <Typography sx={{...textStyle,width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>General Information</Typography>
                                    <Button color={'btnCustomWaring'} variant={'contained'} size={'small'} style={{width:'auto',marginLeft:'auto', height:'40px'}} onClick={() => dispatch(setProfileEdit(true))} fullWidth>Edit</Button>
                                </Box>
                                <StyledTextField 
                                    disabled={disabled} 
                                    action={ updateUserProfile } 
                                    title={"Name"} field={"name"} 
                                    value={userProfile?.name || ''} 
                                    fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
                                />
                                <StyledTextField 
                                    disabled={disabled} 
                                    action={ updateUserProfile } 
                                    title={"Mobile"} field={"phone"} 
                                    value={userProfile?.phone || ''} 
                                    fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                    titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Email"} field={"email"} value={userProfile?.email || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                <Box sx={{display:'flex',width:'100%'}} >
                                 
                                    <Typography sx={{fontFamily: 'Roboto',fontSize: '18px', fontWeight: 600, width:{xs:"30%",lg:"25%"}}}>Position</Typography>
                                    <Box sx={{display:'flex', width:'72%', justifyContent:'space-between'}}>
                                        <StyledDropdown 
                                            filterOptions={Object.keys(companySettings?.departments ) || []}
                                            field={'profile'} 
                                            subField={'department'}  
                                            value={userProfile?.department || ''} 
                                            disabled={disabled} 
                                            action={ updateUserProfile }
                                            fieldStyle={{ width:{ xs: '70%',lg:'90%'} }}
                                        />
                                        <StyledDropdown 
                                            filterOptions={companySettings?.departments[userProfile?.department]?.designations || []}  
                                            field={'profile'} 
                                            subField={'designation'}   
                                            value={userProfile?.designation || ''} 
                                            disabled={disabled} 
                                            action={ updateUserProfile }
                                            fieldStyle={{ width:{ xs: '70%',lg:'90%' }} }
                                        />
                                    </Box>
                                    </Box>
                                    <Typography sx={{...textStyle,width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>Personal Information</Typography>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"NID"} field={"nid"} value={userProfile?.nid || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"TIN"} field={"tin"} value={userProfile?.tin || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledDatePicker 
                                        disabled={disabled}
                                        field={'profile'}
                                        subField={'birth_day'}  
                                        title={"Birth Day"} 
                                        titleStyle={{ fontFamily: 'Roboto',fontSize: '18px'}} 
                                        value={ userProfile?.birth_day }
                                        dispatch={ dispatch }
                                        action={ updateUserProfile }
                                        fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
                                    />

                                    <StyledDropdown 
                                        filterOptions={['Male', 'Female', 'Other']}
                                        field={'profile'} 
                                        subField={'gender'}  
                                        title={"Gender"} 
                                        value={userProfile?.gender || ''}
                                        action={ updateUserProfile }
                                        fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
                                        disabled={disabled}
                                    />
                                    <StyledDropdown 
                                        filterOptions={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                                        field={'profile'} 
                                        subField={'blood_group'}  
                                        title={"Blood Group"} 
                                        value={userProfile?.blood_group || ''}
                                        action={ updateUserProfile }
                                        fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
                                        disabled={disabled}
                                    />
                                </Box>}
                                { (currentProfileTab === "OFFICE DETAILS") && 
                                <Box sx={{ ...tabContent }}>
                                    <Typography sx={{...textStyle,width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>Office Information</Typography>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Office Email :"} field={"office_email"} value={userProfile?.office_email || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Office Mobile :"} field={"office_mobile"} value={userProfile?.office_mobile || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledDatePicker 
                                        disabled={disabled}
                                        field={'profile'}
                                        subField={'joining_date'}  
                                        title={"Joining Date : "} 
                                        titleStyle={{ fontFamily: 'Roboto',fontSize: '18px'}} 
                                        value={ userProfile?.joining_date }
                                        dispatch={ dispatch }
                                        action={ updateUserProfile }
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}
                                        fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                    />
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Reporting Person :"} field={"reporting_person"} value={userProfile?.reporting_person || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Gross Salary : "} field={"basic_salary"} value={userProfile?.basic_salary || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <Typography sx={{...textStyle,width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>Previous Office Information</Typography>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Last Working Place :"} field={"last_working_place"} value={userProfile?.last_working_place || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    
                                </Box>}
                                { (currentProfileTab === "BANK DETAILS") && <Box sx={{ ...tabContent }}>
                                    <Typography sx={{...textStyle, width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>Bank accoiunt Information</Typography>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Account Title :"} field={"account_title"} value={userProfile?.account_title || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Account Number :"} field={"account_number"} value={userProfile?.account_number || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Bank Name :"} field={"bank_name"} value={userProfile?.bank_name || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Branch Name :"} field={"branch_name"} value={userProfile?.branch_name || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Routing Number :"} field={"routing_number"} value={userProfile?.routing_number || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                </Box>}
                                { (currentProfileTab === "EMERGENCY") && <Box sx={{ ...tabContent }}>
                                    <Typography sx={{...textStyle, width:{xs:'35%', lg:'20%'}, boxShadow:1,mb:2}}>Emergency Contact</Typography>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Contact Person :"} field={"contact_person"} value={userProfile?.contact_person || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Mobile Number"} field={"emergency_mobile_number"} value={userProfile?.emergency_mobile_number || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    <StyledTextField disabled={disabled} action={ updateUserProfile } title={"Relationship"} field={"relationship"} value={userProfile?.relationship || ''} fieldStyle={{ width:{xs:'55%', lg:'70%'} }}
                                        titleContainerStyle={{width:{xs:'30%', lg:'25%'} }}/>
                                    
                                </Box>}
                            </Box>  
                        </Box>
                        { (!disabled) &&
                        <Box sx={{ display:'flex', width:{xs:'85%', lg:'95%'}, height:'40px',px:2, pt:0, ml:0 , justifyContent:'flex-end'}}>
                            <Button veriant={'success'} style={{width:'20%',border:'1px solid green'}} onClick={() => dispatch(setUserProfileAction(userProfile.user_id,userProfile))}>Save</Button>
                        </Box>
                        }
                    </Box>
                </Box>
            </Box>
        );
    }
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
const tabContent = {
    display:'flex',
    flexDirection: 'column',
    gap:1
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
    profileEdit: state?.admin?.profileEdit,
    currentProfileTab: state?.employeeList?.currentProfileTab,
    profile: state?.employeeList?.profile,
    userProfile: state?.admin?.userProfile,
    companySettings: state?.admin?.companySettings,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)