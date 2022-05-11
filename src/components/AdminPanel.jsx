import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

import { setActivityStatus } from '../redux/reducers/adminReducer'

const GridContent = (props) => {
    
    return (
    <Grid item sx={{border: '1px solid black',m:0,mt:2,p:0,borderRadius:2, width:'100%'}}>
        <Typography>{props.title}</Typography>
        {props.children}
    </Grid>
        )
}

class AdminPanel extends React.PureComponent{
    constructor(props){
        super(props)
    }

    render(){
        const {activityStatus, activityStatusOptions} = this.props
        //console.log('props options ',this.props, activityStatusOptions)
        return (
            <Box sx={{width:'100%'}} >
                <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'} />
                <Grid container spacing={2} sx={{mt:3,px:5}}>

                    {/*Job Statuc*/}
                    <GridContent title={"Job Status"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid item>
                                <StyledInputField placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid item>
                                <StyledSelect onChange={setActivityStatus} value={activityStatus} options={activityStatusOptions}/>
                            </Grid>
                            <Grid item>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'5vw'}}>Update</StyledButton>
                            </Grid>

                        </Grid>
                    </GridContent>

                    {/*Notice*/}
                    <GridContent title={"Notice"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid item>
                                <StyledInputField placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid item>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'5vw'}}>Post</StyledButton>
                            </Grid>
                        </Grid>
                    </GridContent>

                    {/*Add User*/}
                    <GridContent title={"Add User"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid item>
                                <StyledInputField placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>    
                            </Grid>
                            <Grid item>
                                <StyledInputField placeholder={"E-Mail"} ariaLabel={"E-Mail"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid item>
                                <StyledInputField placeholder={"Mobile"} ariaLabel={"Mobile"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid item>
                                <StyledInputField placeholder={"CSV File"} ariaLabel={"CSV File"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid item>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'5vw'}}>Upload</StyledButton>
                            </Grid>
                        </Grid>
                    </GridContent>
                </Grid>
            </Box>
        );
    }
}

// export default AdminPanel;
const mapStateToProps = state => ({
    activityStatus: state.admin.activityStatus,
    activityStatusOptions: state.admin.activityStatusOptions,
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)