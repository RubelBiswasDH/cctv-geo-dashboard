import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, Grid, Typography, Paper, InputBase, Button } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'
import image from '../assets/profile-image.jpg'

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
    const {title, value} = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize:'12px',
    }
    return (
    <Grid xs={12} item container sx={{ border:'none' }}>
        <Grid item xs={5}><Typography sx={{...textStyle, opacity: 0.7, fontWeight:300}}>{title}</Typography></Grid>
        <Grid item xs={7}><Typography sx={{...textStyle, fontWeight:600}}>{value}</Typography></Grid>
    </Grid>
    )
}

class Profile extends React.PureComponent {
    constructor(props) {
        super(props)
    }



    render() {

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
                    <StyledAppBar title={'Name: Abu Sufiyan'} bgColor={'#FF6961'} style={{ borderRadius: '4px' }} />
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
                        <Grid item xs={12} sx={{p:2}}><Typography sx={{fontFamily:'Roboto',fontStyle: 'normal', fontWeight:500,fontSize:'19px', color:'#000000'}}>{"Abu Sufiyan"}</Typography></Grid>
                    </Grid>
                    {/* Right */}
                    <Grid xs={8} sx={{p:3,border:'none' }} item container>
                        {/* Grid 1 */}
                        <GridContent  style={{}}>
                            {/* <ProfileRow  title={"Title"} value={'Value'}/> */}
                            <ProfileRow  title={"Phone"} value={'+8801234234534'}/>
                            <ProfileRow  title={"DOB:"} value={'03/06/1990'}/>
                            <ProfileRow  title={"Father name:"} value={'Abu Sufiyan'}/>
                            <ProfileRow  title={"Mother name:"} value={'Sumaiya Sufiyan'}/>
                            <ProfileRow  title={"TIN:"} value={'1049181351357'}/>
                            <ProfileRow  title={"Blood group:"} value={'O+ (Positive)'}/>
                            <ProfileRow  title={"Marritial Status:"} value={'Married'}/>
                            <ProfileRow  title={"Address:"} value={'6, bijoy nagar (old 22), (3rd floor) kakrail, 1000'}/>
                            <ProfileRow  title={"Permanent Address:"} value={'6, bijoy nagar (old 22), (3rd floor) kakrail, 1000'}/>
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <ProfileRow  title={"Job Status:"} value={'In Service'}/> 
                            <ProfileRow  title={"Department:"} value={'Tech Team'}/> 
                            <ProfileRow  title={"Designation:"} value={'Jr. Front End Dev'}/> 
                            <ProfileRow  title={"Joining date:"} value={'09 - April- 2021'}/> 
                            <ProfileRow  title={"Reliving date:"} value={'-- -- -- -- -- -- -- --'}/> 
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <ProfileRow  title={"Gross:"} value={'15,000 Taka'}/> 
                            <ProfileRow  title={"Basic:"} value={'10,000 Taka'}/> 
                            <ProfileRow  title={"Medical:"} value={'2,500 Taka'}/> 
                            <ProfileRow  title={"Convenience fee:"} value={'2,500 Taka'}/> 
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
    value: "Value"
}


GridContent.propTypes = {
    style: PropTypes.object
}

GridContent.defaultProps = {
    style: {}
}

// export default Profile;
const mapStateToProps = state => ({
    activityStatus: state.admin.activityStatus,
    activityStatusOptions: state.admin.activityStatusOptions,

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)