import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase, Button } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

// import { setActivityStatus, setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput, setAnnouncementMessage } from '../redux/reducers/adminReducer'
// import { createUser, createBulkUser, createNotice } from '../redux/actions/adminActions'


const GridContent = (props) => {
    const { style } = props
    return (
        <Grid xs={12} item sx={{ m: 0, mt: 2, p: 0, borderRadius: 2, border: "1px solid black", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '', ...style }}>
            {props.children}
        </Grid>
    )
}

class Profile extends React.PureComponent {
    constructor(props) {
        super(props)
    }



    render() {

        // const {activityStatus, activityStatusOptions, department, departmentOptions, contractType, contractTypeOptions, designation, designationOptions, newUserName, newUserEmail, newUserMobile, newUserRole, newUserRoleOptions, announcementMessage} = this.props
        //console.log('props options ',this.props, activityStatusOptions)
        return (
            <Box sx={
                theme => ({
                    padding: {
                        xs: `${theme.spacing(0)}`,
                        md: theme.spacing(0)
                    },
                    // border:'1px solid red',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                }
                )}
            >
                <Grid xs={12} container spacing={0} sx={{ mt: 0, pl: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StyledAppBar bgColor={'#FF6961'} style={{ borderRadius: '4px' }} />
                </Grid>
                <Grid xs={12} container spacing={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Left */}
                    <Grid xs={4} item container>

                    </Grid>
                    {/* Right */}
                    <Grid xs={8} item container>


                        {/* Grid 1 */}
                        <GridContent  >
                            <Grid xs={12} container spacing={2} sx={{ p: 4, pt: 2, backgroundColor: '' }}>
                                <Grid xs={6} item sx={{ background: '' }}>
                                    
                                </Grid>
                                <Grid xs={5} item sx={{ background: '' }}>
                                    <Grid container xs={12} spacing={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '' }}>
                                    </Grid>
                                </Grid>
                                <Grid xs={3} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                                </Grid>

                            </Grid>
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent >
                            <Grid container spacing={2} sx={{ p: 4, pt: 2, }}>
                                <Grid xs={9} item sx={{ pr: 2 }}>
                                </Grid>
                                <Grid xs={3} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                                </Grid>
                            </Grid>
                        </GridContent>

                        {/* Grid 2*/}
                        <GridContent  style={{ p: 1 }}>
                            <Grid xs={12} container spacing={2} sx={{ p: 4, pt: 2, background: '' }}>
                                <Grid xs={12} spacing={2} item container>
                                    <Grid xs={4} xl={3} item sx={{ backgroundColor: '' }}>
                                    </Grid>
                               
                                   
                                </Grid>
                                <Grid xs={12} item container spacing={2}>
                                  
                                </Grid>

                            </Grid>
                        </GridContent>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

// export default Profile;
const mapStateToProps = state => ({
    activityStatus: state.admin.activityStatus,
    activityStatusOptions: state.admin.activityStatusOptions,

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Profile)