import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase} from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

import { setActivityStatus,setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput,setAnnouncementMessage } from '../redux/reducers/adminReducer'
import { createUser, createBulkUser, createNotice } from '../redux/actions/adminActions'

const FileInput = (props) => {
    const {style, onChange} = props
    return (
        <Paper
            sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#5F5F5F', color: 'white', px: '10px', ...style }}
        >
            <InputBase
                sx={{ ml: 0, mt: .5, flex: 1, color: 'white', opacity: 1 }}
                placeholder={"placeholder"}
                inputProps={{ 'aria-label': "ariaLabel", color: 'transparent','type':'file',multiple:true }}
                // value={value}
                onChange={onChange}

            />
            {/* <IconButton sx={{ p: '10px' }} aria-label={ariaLabel}>
                <SearchIcon sx={{ color: 'white' }} />
            </IconButton> */}
        </Paper>
    );
}
const GridContent = (props) => {
    const {style} = props
    return (
    <Grid xs={12} item sx={{m:0,mt:2,p:0,borderRadius:2,border:"1px solid black",display:'flex', alignItems:'center', justifyContent:'center',flexDirection:'column',background:'',...style}}>
        <Typography sx={{width:'90%',fontSize:'.8em',fontWeight:600,background:'',pl:0,pt:2}}>{props.title}</Typography>
        {props.children}
    </Grid>
        )
}

class AdminPanel extends React.PureComponent{
    constructor(props){
        super(props)
        this.handleCreateUser = this.handleCreateUser.bind(this)
        this.handleFileInput = this.handleFileInput.bind(this)
        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.handleNotice = this.handleNotice.bind(this)
 
    }

    handleNotice = e => {
        e.preventDefault()
        const {dispatch, announcementMessage} = this.props
        const message = {
            message: announcementMessage,
        }
        if(announcementMessage){
            // console.log('all field filled')
            dispatch(createNotice(message))
            // console.log('dispatch createUser',dispatch,createUser)
            // console.log('dipatch create user')
        }
        else{ 
            alert('Notice field is empty')
        }
    }

    handleFileUpload = e => {
        e.preventDefault()
        const {dispatch,fileInput} = this.props
        const file = {users:fileInput}
        // const users = {users: fileInput}
        dispatch(createBulkUser(fileInput))
        //console.log('file uploaded, file: ',this.props.fileInput)
    }


    handleFileInput = e => {
        const {dispatch,fileInput} = this.props
        e.preventDefault()
        const file = e.target.files[0]
        dispatch(setFileInput(file))
        //console.log('file ',file)
    }


    handleCreateUser = (e) => {
        e.preventDefault()
        const {dispatch, newUserName, newUserEmail, newUserMobile, newUserRole} = this.props
        const user = {
            name: newUserName,
            user_level: newUserRole,
            phone: newUserMobile,
            email: newUserEmail
        }
        if(newUserName && newUserMobile && newUserEmail && newUserRole){
            // console.log('all field filled')
            dispatch(createUser(user))
            // console.log('dispatch createUser',dispatch,createUser)
            // console.log('dipatch create user')
        }
        else{ 
            alert('All fields are required')
        }
        //console.log('create user clicked, user is: ', user)
    }

    render(){
        const {handleCreateUser,handleFileInput, handleFileUpload, handleNotice} = this
        const {activityStatus, activityStatusOptions, department, departmentOptions, contractType, contractTypeOptions, designation, designationOptions, newUserName, newUserEmail, newUserMobile, newUserRole, newUserRoleOptions, announcementMessage} = this.props
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
                <Grid xs={12} container spacing={0} sx={{mt:0,display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'}  style={{borderRadius: '4px'}} />
                </Grid>
                <Grid xs={12} container spacing={0} sx={{mt:1,display:'flex', alignItems:'center', justifyContent:'center'}}>

                    {/*Job Statuc*/}
                    <GridContent title={"Job Status"} >
                        <Grid xs={12} container spacing={2} sx={{p:4,pt:2,backgroundColor:''}}>
                            <Grid xs={4} item sx={{background:''}}>
                                <StyledInputField placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid xs={5} item sx={{background:''}}>
                                <Grid container xs={12} spacing={1} sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center', flexWrap:'wrap',backgroundColor:''}}>
                                    <StyledSelect xs={6} onChange={setActivityStatus} value={activityStatus} options={activityStatusOptions}/>
                                    <StyledSelect xs={6} onChange={setDepartment} value={department} options={departmentOptions}/>
                                    <StyledSelect xs={6} onChange={setContractType} value={contractType} options={contractTypeOptions}/>
                                    <StyledSelect xs={6} onChange={setdesignation} value={designation} options={designationOptions}/>
                                </Grid>
                            </Grid>
                            <Grid xs={3} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'100%'}}>Update</StyledButton>
                            </Grid>

                        </Grid>
                    </GridContent>

                    {/*Notice*/}
                    <GridContent title={"Notice"} >
                        <Grid container spacing={2} sx={{p:4,pt:2,}}>
                            <Grid xs={9} item sx={{pr:2}}>
                                <StyledInputField onChange={setAnnouncementMessage} value={announcementMessage} placeholder={"Notice"} ariaLabel={"Notice"} style={{borderRadius:2,height:'8vh'}}/>
                            </Grid>
                            <Grid xs={3} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                                <StyledButton onClick={handleNotice} variant="contained" style={{borderRadius:2,pt:1,width:'100%'}}>Post</StyledButton>
                            </Grid>
                        </Grid>
                    </GridContent>

                    {/*Add User*/}
                    <GridContent title={"Add User"} style={{p:1}}>
                        <Grid xs={12} container spacing={2} sx={{p:4,pt:2,background:''}}>
                           <Grid xs={12} spacing={2} item container>
                                <Grid xs={4} xl={3} item sx={{backgroundColor:''}}>
                                    <StyledInputField onChange={setNewUserName} value={newUserName} placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>    
                                </Grid>
                                <Grid xs={4} xl={3} item>
                                    <StyledInputField onChange={setNewUserEmail} value={newUserEmail} placeholder={"E-Mail"} ariaLabel={"E-Mail"} style={{borderRadius:2}}/>
                                </Grid>
                                <Grid xs={4} xl={3} item>
                                    <StyledInputField onChange={setNewUserMobile} value={newUserMobile} placeholder={"Mobile"} ariaLabel={"Mobile"} style={{borderRadius:2}}/>
                                </Grid>
                                <Grid xs={4} xl={1.5} item>
                                    <StyledSelect onChange={setNewUserRole} value={newUserRole} options={newUserRoleOptions} style={{minWidth:'100%'}}/>
                                </Grid>
                                <Grid xs={4} xl={1.5} item>
                                    <StyledButton onClick= {handleCreateUser} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>Create</StyledButton>
                                </Grid>
                           </Grid>
                           <Grid xs={12} item container spacing={2}>
                                <Grid xs={4} item>
                                    <FileInput placeholder={"CSV File"} ariaLabel={"CSV File"} onChange={handleFileInput} style={{borderRadius:2}}/>
                                </Grid>
                                <Grid xs={4} item>
                                    <StyledButton onClick= {handleFileUpload} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>Upload</StyledButton>
                                </Grid>
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
    department: state.admin.department,
    departmentOptions: state.admin.departmentOptions,
    contractType: state.admin.contractType,
    contractTypeOptions: state.admin.contractTypeOptions,
    designation: state.admin.designation,
    designationOptions: state.admin.designationOptions,
    newUserName: state.admin.newUserName,
    newUserEmail: state.admin.newUserEmail,
    newUserMobile:state.admin.newUserMobile,
    newUserRole: state.admin.newUserRole,
    newUserRoleOptions: state.admin.newUserRoleOptions,
    fileInput: state.admin.fileInput,
    announcementMessage: state.admin.announcementMessage,
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)