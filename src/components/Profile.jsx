import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, Grid, Typography, Paper, InputBase, Button, TextField } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'
import image from '../assets/profile-image.jpg'

import {getUserProfile} from '../redux/actions/adminActions'

// import { setActivityStatus, setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput, setAnnouncementMessage } from '../redux/reducers/adminReducer'
// import { createUser, createBulkUser, createNotice } from '../redux/actions/adminActions'


const GridContent = (props) => {
    const { style } = props
    return (
        <Grid xs={12} item sx={{ m: 0, mt: 2, p: 2,gap:1.5, borderRadius: 2, border: "1px solid black", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style }}>
            {props.children}
        </Grid>
    )
}

const ProfileRow = (props) => {
    const {title, value, onClick, isFocused, onChange, onBlur} = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize:'12px',
    }
    return (
    <Grid xs={12} item container sx={{ border:'none' }}>
        <Grid item xs={5}><Typography sx={{...textStyle, opacity: 0.7, fontWeight:300}}>{title}</Typography></Grid>
        <Grid item xs={7}>{(!isFocused)?<Typography sx={{...textStyle, fontWeight:600}}>{(value)?value:"-- -- -- -- -- --"}</Typography>
        : <TextField
            hiddenLabel
            fullWidth
            defaultValue="Small"
            value={(value)?value:""}
            variant="outlined"
            size="small"
            sx={{borderBottom:'1px solid green',outline:'none',m:0,p:0}}
            inputProps={{border:'none',outline:'none',p:0,pl:.25,pb:0}}
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
        this.props.dispatch(getUserProfile('22'));
    }
    render() {
        const {userProfile} = this.props

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
                    <StyledAppBar title={`Name: ${userProfile.name}`} bgColor={'#FF6961'} style={{ borderRadius: '4px' }} />
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
                            <ProfileRow  title={"Phone"} value={userProfile.phone} isFocused={true} onClick={() => null} onChange={() => null} onBlur={() => null}/>
                            <ProfileRow  title={"DOB:"} value={userProfile.dob}/>
                            <ProfileRow  title={"Father name:"} value={userProfile.father}/>
                            <ProfileRow  title={"Mother name:"} value={userProfile.mother}/>
                            <ProfileRow  title={"TIN:"} value={userProfile.tin}/>
                            <ProfileRow  title={"Blood group:"} value={userProfile.blood_group}/>
                            <ProfileRow  title={"Marritial Status:"} value={userProfile.blood_group}/>
                            <ProfileRow  title={"Address:"} value={userProfile.address}/>
                            <ProfileRow  title={"Permanent Address:"} value={userProfile.permanent_address}/>
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <ProfileRow  title={"Job Status:"}  value={userProfile.job_status}/> 
                            <ProfileRow  title={"Department:"}  value={userProfile.department}/> 
                            <ProfileRow  title={"Designation:"} value={userProfile.designation}/> 
                            <ProfileRow  title={"Joining date:"} value={userProfile.joining_date}/> 
                            <ProfileRow  title={"Reliving date:"} value={userProfile.reliving_date}/> 
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <ProfileRow  title={"Gross:"} value={userProfile.gross}/> 
                            <ProfileRow  title={"Basic:"} value={userProfile.basic}/> 
                            <ProfileRow  title={"Medical:"} value={userProfile.medical}/> 
                            <ProfileRow  title={"Convenience fee:"} value={userProfile.convenience_fee}/> 
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
    value: "Unavailable"
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

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)