import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, Grid, Typography, Paper, InputBase, Button, TextField } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'
import image from '../assets/profile-image.jpg'

import {getUserProfile, setUserProfileAction} from '../redux/actions/adminActions'
import { setUserProfile, updateUserProfile, setProfileEdit } from '../redux/reducers/adminReducer'
// import { setActivityStatus, setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput, setAnnouncementMessage } from '../redux/reducers/adminReducer'
// import { createUser, createBulkUser, createNotice } from '../redux/actions/adminActions'

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
    const {title, value,field, dispatch, profileEdit,userProfile} = props
    const [focus,setFocus] = React.useState(false)

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
    constructor(props) {
        super(props)
    }

    
    componentDidMount(){
        // this.props.dispatch(getUserProfile('22'));
    }
    render() {
        const {userProfile, profileEdit, dispatch} = this.props
        // console.log({setProfileEdit})
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
                    // border:'1px solid green',
                    ml:'8px'
                }
                )}
            >
                <Grid xs={12} container spacing={0} sx={{ mt: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StyledAppBar title={`Name: ${(userProfile?.name)?userProfile?.name:""}`} bgColor={'#FF6961'} style={{ borderRadius: '4px' }} />
                </Grid>
                <Grid xs={12} container spacing={0} sx={{ display: 'flex',flexDirection:'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    {/* Left */}
                    <Grid xs={4} item container sx={{display:'flex',p:0,pl:3,pt:3,flexDirection:'column',alignItems:'center',justifyContent:'flex-start',border:''}}>
                        <Grid item xs={12} sx={{mt: 2, p: 0,gap:1.5,border:'' }}>
                            <img
                                src={ image }
                                alt='profile-image'
                                width='100%'
                                height='100%'
                            />    
                        </Grid>
                        <Grid item xs={12} sx={{p:2}}><Typography sx={{fontFamily:'Roboto',fontStyle: 'normal', fontWeight:500,fontSize:'19px', color:'#000000'}}>{userProfile.name}</Typography></Grid>
                    </Grid>
                    {/* Right */}
                    <Grid xs={8} sx={{p:3,border:'none' }} item container>
                        {/* Grid 1 */}
                        <GridContent  style={{}}>
                            {/* <ProfileRow  title={"Title"} value={'Value'}/> */}
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Name"} value={userProfile.name} field={"name"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Employee ID"} value={userProfile.employee_id} field={"employee_id"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Personal Contact No"} value={userProfile.personal_contact_no} field={"personal_contact_no"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Personal Email"} value={userProfile.personal_email} field={"personal_email"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"House Address"} value={userProfile.house_address} field={"house_address"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Birth Date"} value={userProfile.birth_date} field={"birth_date"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Gender"} value={userProfile.gender} field={"gender"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Marritial Status"} value={userProfile.marritial_status} field={"marritial_status"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"NID"} value={userProfile.nid} field={"nid"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"TIN"} value={userProfile.tin} field={"tin"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Educational Qualification"} value={userProfile.educational_qualification} field={"educational_qualification"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Personal Email"} value={userProfile.personal_email} field={"personal_email"} />



                         </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Offical Email"} value={userProfile.official_email} field={"official_email"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Office Phone No"} value={userProfile.office_phone_no} field={"office_phone_no"} />
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Designation"} value={userProfile.designation} field={"designation"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Job Status"}  value={userProfile.job_status} field={"job_status"}/> 

                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Reporting Person"}  value={userProfile.reporting_person} field={"reporting_person"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Joining date"} value={userProfile.joining_date} field={"joining_date"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"End of Probation"}  value={userProfile.end_of_robation} field={"end_of_robation"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Last Performance Review"}  value={userProfile.last_performance_review} field={"last_performance_review"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Next Performance Review"}  value={userProfile.next_performance_review} field={"next_performance_review"}/> 
                        </GridContent>

                        {/* Grid 3*/}
                        <GridContent title={"Last Work Place"} >
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Company Name"} value={userProfile.previous_company} field={"previous_company"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Designation"} value={userProfile.previous_designation} field={"previous_designation"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Responsibilities"} value={userProfile.previous_responsibilities} field={"previous_responsibilities"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Salary"} value={userProfile.previous_salary} field={"previous_salary"}/> 
                        </GridContent>
                        {/* Grid 4*/}
                        <GridContent title={"Emergency"}>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Blood group"} value={userProfile.blood_group} field={"blood_group"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Contact Person"} value={userProfile.contact_person} field={"contact_person"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Contact No"} value={userProfile.emergency_contact_no} field={"emergency_contact_no"}/>
                        </GridContent>

                        {/* Grid 5*/}

                        <GridContent title={"Benefits"}>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Salary"} value={userProfile.salary} field={"salary"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Bank Name"} value={userProfile.casual_leave} field={"casual_leave"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Sick Leave"}  value={userProfile.sick_leave} field={"sick_leave"}/> 
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Festival Bonus"} value={userProfile.festival_bonus} field={"festival_bonus"}/>
                        </GridContent>
                        <GridContent title={"Bank Account Details"}>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Account Title"} value={userProfile.account_title} field={"account_title"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Account No"} value={userProfile.account_no} field={"account_no"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Bank Name"} value={userProfile.bank_name} field={"bank_name"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Branch Name"} value={userProfile.branch_name} field={"branch_name"}/>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"Routing No"} value={userProfile.routing_no} field={"routing_no"}/>
                        </GridContent>

                        {/* Grid 6*/}
                        <GridContent title={"Cv/Resume"}>
                            <ProfileRow dispatch={dispatch} profileEdit={profileEdit}  title={"CV URL"} value={userProfile.cv_url} field={"cv_url"}/>
                        </GridContent>
                        <GridContent style={{flexDirection:'row'}} >
                            <Grid item xs={6}><StyledButton style={{width:'100%', bg:'orange'}} onClick={() => dispatch(setProfileEdit(true))} fullWidth>Edit</StyledButton></Grid>
                            <Grid item xs={6}><StyledButton style={{width:'100%'}} onClick={() => dispatch(setUserProfileAction(userProfile.user_id,userProfile))}>Save</StyledButton></Grid>
                        </GridContent>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

// Prop Types
ProfileRow.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string
}

ProfileRow.defaultProps = {
    title: "Title",
    value: ""
}


GridContent.propTypes = {
    style: PropTypes.object
}

GridContent.defaultProps = {
    style: {}
}

// export default Profile;
const mapStateToProps = state => ({
    userProfile: state.admin.userProfile,
    profileEdit: state.admin.profileEdit,

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)