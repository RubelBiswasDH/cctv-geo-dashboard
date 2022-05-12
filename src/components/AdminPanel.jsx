import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase} from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

import { setActivityStatus,setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput } from '../redux/reducers/adminReducer'
import { createUser, createBulkUser } from '../redux/actions/adminActions'

const FileInput = (props) => {
    const {style, onChange} = props
    return (
        <Paper
            sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#5F5F5F', color: 'white', px: '10px', ...style }}
        >
            <InputBase
                sx={{ ml: 3, mt: .5, flex: 1, color: 'white', opacity: 1 }}
                placeholder={"placeholder"}
                inputProps={{ 'aria-label': "ariaLabel", color: 'white','type':'file',multiple:true }}
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
    
    return (
    <Grid item sx={{border: '1px solid black',m:0,mt:2,p:0,px:10,borderRadius:2, width:'100%'}}>
        <Typography>{props.title}</Typography>
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
        
    }


    handleFileUpload = e => {
        e.preventDefault()
        const {dispatch,fileInput} = this.props
        const file = {users:fileInput}
        // const users = {users: fileInput}
        dispatch(createBulkUser(file))
        console.log('file uploaded, file: ',this.props.fileInput)
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
        const {handleCreateUser,handleFileInput, handleFileUpload} = this
        const {activityStatus, activityStatusOptions, department, departmentOptions, contractType, contractTypeOptions, designation, designationOptions, newUserName, newUserEmail, newUserMobile, newUserRole, newUserRoleOptions} = this.props
        //console.log('props options ',this.props, activityStatusOptions)
        return (
            <Box sx={{width:'100%',px:5}} >
                <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'} />
                <Grid container spacing={2} sx={{mt:3}}>

                    {/*Job Statuc*/}
                    <GridContent title={"Job Status"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid sx={4} item sx={{background:''}}>
                                <StyledInputField placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid xs={5} item sx={{background:''}}>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center', flexWrap:'wrap',gap:2,width: '100%',backgroundColor:''}}>
                                    <StyledSelect onChange={setActivityStatus} value={activityStatus} options={activityStatusOptions}/>
                                    <StyledSelect onChange={setDepartment} value={department} options={departmentOptions}/>
                                    <StyledSelect onChange={setContractType} value={contractType} options={contractTypeOptions}/>
                                    <StyledSelect onChange={setdesignation} value={designation} options={designationOptions}/>
                                </Box>
                            </Grid>
                            <Grid xs={3} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'100%'}}>Update</StyledButton>
                            </Grid>

                        </Grid>
                    </GridContent>

                    {/*Notice*/}
                    <GridContent title={"Notice"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid xs={9} item sx={{pr:2}}>
                                <StyledInputField placeholder={"Notice"} ariaLabel={"Notice"} style={{borderRadius:2,height:'8vh'}}/>
                            </Grid>
                            <Grid xs={3} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                                <StyledButton variant="contained" style={{borderRadius:2,pt:1,width:'100%'}}>Post</StyledButton>
                            </Grid>
                        </Grid>
                    </GridContent>

                    {/*Add User*/}
                    <GridContent title={"Add User"} >
                        <Grid container spacing={2} sx={{p:2}}>
                            <Grid xs={3} item sx={{backgroundColor:''}}>
                                <StyledInputField onChange={setNewUserName} value={newUserName} placeholder={"Name"} ariaLabel={"Name"} style={{borderRadius:2}}/>    
                            </Grid>
                            <Grid xs={3} item>
                                <StyledInputField onChange={setNewUserEmail} value={newUserEmail} placeholder={"E-Mail"} ariaLabel={"E-Mail"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid xs={3} item>
                                <StyledInputField onChange={setNewUserMobile} value={newUserMobile} placeholder={"Mobile"} ariaLabel={"Mobile"} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid xs={2} item>
                                <StyledSelect onChange={setNewUserRole} value={newUserRole} options={newUserRoleOptions} style={{minWidth:'100%'}}/>
                            </Grid>
                            <Grid xs={1} item>
                                <StyledButton onClick= {handleCreateUser} variant="contained" style={{borderRadius:2,pt:1,minWidth:'100%'}}>Create</StyledButton>
                            </Grid>
                            <Grid xs={6} item>
                                <FileInput placeholder={"CSV File"} ariaLabel={"CSV File"} onChange={handleFileInput} style={{borderRadius:2}}/>
                            </Grid>
                            <Grid xs={3} item>
                                <StyledButton onClick= {handleFileUpload} variant="contained" style={{borderRadius:2,pt:1,width:'5vw'}}>Upload</StyledButton>
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
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)