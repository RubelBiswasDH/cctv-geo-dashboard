import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase, Button, ButtonBase} from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

import { setActivityStatus,setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput,setAnnouncementMessage,setLateTime, setWorkingDays, setMonthYear, updateCompanySettings } from '../redux/reducers/adminReducer'
import { createUser, createBulkUser, createNotice, setLateTimeAction, setWorkingDaysAction, getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"
import dayjs from 'dayjs'

const FileInput = (props) => {
    const {style, onChange} = props
    return (
        <Paper
            sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#5F5F5F', color: 'white', px: '10px', ...style }}
        >
            <InputBase
                sx={{ ml: 0, mt: .5, flex: 1,background:'transparent', color: 'white', opacity: 1 }}
                placeholder={"placeholder"}
               
                inputProps={{  hidden:true,'aria-label': "ariaLabel", style:{color: 'transparent',visibility: '',backgroundColor:'transparent'},'type':'file',multiple:true }}
                // value={value}
                onChange={onChange}

            />
            {/* <IconButton sx={{ p: '10px' }} aria-label={ariaLabel}>
                <SearchIcon sx={{ color: 'white' }} />
            </IconButton> */}
            {/* <Button>
            Upload File
                <input
                    type="file"
                    hidden
                />
            </Button> */}
        </Paper>
    );
}
const InputButton = (props) => {
    const { style, onChange } = props
    const fileInput = React.useRef();
    var title = (fileInput?.current && fileInput.current.files.length > 0)?fileInput.current?.files[0]?.name:"CSV File"

    // (fileInput.current.files?.length > 0 )?console.log("file : ",fileInput.current.files[0].name):''
    // if(fileInput?.current && fileInput.current.files.length > 0){
    //     // console.log(fileInput.current.files.length > 0)
    //     // console.log({file: fileInput.current?.files[0]?.name})
    // }
    
    return (
        <Paper
            sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#887A7A', color: 'white', borderRadius: 2 }}
        >
            <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ textTransform: 'none', borderRadius: 2, m: 0 }}
                onClick={() => fileInput.current.click()}
            >
                <Typography
                    sx={{
                        color: 'white',
                        fontSize: '.8em',
                        fontWeight: 800,
                        pt: .5,
                        pl: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        fontSize: "14px",
                        fontWeight: 500,
                        flex: 1,
                        color: 'white',
                        opacity: 1,
                        borderRadius: 2
                    }}>
                    {title}
                </Typography>
            </Button>
            <input
                ref={fileInput}
                type="file"
                style={{ display: 'none' }}
                onChange={onChange}
            />
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
        this.handleSetLateTime = this.handleSetLateTime.bind(this)
        this.handleSetWorkingDays = this.handleSetWorkingDays.bind(this)
        // this.handleCompanySettings = this.handleCompanySettings.bind(this)
    }
    componentDidMount(){
        this.props.dispatch(getCompanySettingsAction())
        // console.log('get company settings')
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
            dispatch(setToastMessage('Notice field is empty'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))

            // alert('Notice field is empty')
        }
    }

    handleFileUpload = e => {
        e.preventDefault()
        const {dispatch,fileInput} = this.props
        console.log('fileInput: ',fileInput)
        // // const file = {users:fileInput}
        const formData = new FormData();
        formData.append("users",fileInput)
        // const users = {users: fileInput}
        dispatch(createBulkUser(formData))
        //console.log('file uploaded, file: ',this.props.fileInput)
    }

    handleFileInput = e => {
        const {dispatch,fileInput} = this.props
        e.preventDefault()
        const file = e.target.files[0]
        // const formData = new FormData();
        // formData.append("users",file)
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
            dispatch(setToastMessage('All fields are required'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
        //console.log('create user clicked, user is: ', user)
    }

    handleSetLateTime = (e) => {
        e.preventDefault()
        const { dispatch, lateTime, monthYear, workingDays, companySettings } = this.props
        if (lateTime.length > 0) {
            const new_settings = {
                late_time: lateTime
            }

            dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }))
        }
        else {
            dispatch(setToastMessage('Time is required'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    handleSetWorkingDays = (e) => {
        e.preventDefault()
        const { dispatch, lateTime, monthYear, workingDays, companySettings } = this.props
        if (workingDays.length > 0 && monthYear.length > 0) {
            const new_settings = {
                "working_day": {
                    ...companySettings.working_day,
                    [monthYear]: workingDays,
                }
            }

            dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }))
        }
        else {
            dispatch(setToastMessage('both fields are required'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    // handleCompanySettings = (e) => {
    //     e.preventDefault()
    //     const {dispatch, lateTime, monthYear, workingDays, companySettings} = this.props
    //     const new_settings = {
    //         "working_day": {
    //             ...companySettings.working_day,
    //             [monthYear]:workingDays,
    //         },
           
    //         late_time: lateTime
    //     }
    
    //     dispatch(setCompanySettingsAction({...companySettings,...new_settings}))
    // }

    render(){
        const {handleCreateUser,handleFileInput, handleFileUpload, handleNotice, handleSetLateTime, handleSetWorkingDays} = this
        const {dispatch, activityStatus, activityStatusOptions, department, departmentOptions, contractType, contractTypeOptions, designation, designationOptions, newUserName, newUserEmail, newUserMobile, newUserRole, newUserRoleOptions, announcementMessage, lateTime, workingDays, monthYear, companySettings} = this.props
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
                <Grid xs={12} container spacing={0} sx={{mt:0,pl:1,display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'}  style={{borderRadius: '4px'}} />
                </Grid>
                <Grid xs={12} container spacing={0} sx={{mt:1,px:4,display:'flex', alignItems:'center', justifyContent:'center'}}>

                    {/*Job Statuc*/}
                    {/* <GridContent title={"Job Status"} >
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
                    </GridContent> */}

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
                                {/* <Grid xs={4} item>
                                    <FileInput placeholder={"CSV File"} ariaLabel={"CSV File"} onChange={handleFileInput} style={{borderRadius:2}}/>
                                </Grid> */}
                                <Grid xs={4} item>
                                    <InputButton onChange={handleFileInput}></InputButton>
                                </Grid>
                                <Grid xs={4} item>
                                    <StyledButton onClick= {handleFileUpload} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>Upload</StyledButton>
                                </Grid>
                           </Grid>
                            
                        </Grid>
                    </GridContent>
                    {/*Company Settings*/}
                    <GridContent title={"Company Settings"} >
                    <Grid xs={12} container spacing={2} sx={{p:4,pt:2,background:''}}>
                        <Grid xs={12} spacing={2} item container>
                            <Grid xs={4} xl={3} item sx={{backgroundColor:''}}>
                                <Typography 
                                    sx={{
                                        py:1,
                                        pl:3, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start', 
                                        backgroundColor: 'white',
                                        fontSize:"14px",
                                        fontWeight:500,
                                        flex: 1, 
                                        color: 'black', 
                                        opacity: 1,
                                        borderRadius:2,
                                        border:'1px solid black'
                                        }}>
                                        {`Late Time: ${(companySettings && companySettings.late_time)?companySettings.late_time:""}`}
                                </Typography>                            
                            </Grid>
                            <Grid xs={4} xl={3} item>
                                <Typography 
                                        sx={{
                                            py:1,
                                            pl:3, 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start', 
                                            backgroundColor: 'white',
                                            fontSize:"14px",
                                            fontWeight:500,
                                            flex: 1, 
                                            color: 'black', 
                                            opacity: 1,
                                            borderRadius:2,
                                            border:'1px solid black'
                                            }}>
                                            {`Working Days : ${(companySettings && companySettings.working_day)?companySettings?.working_day[dayjs(new Date()).format('YY-MM').toString()]:""}`}
                                </Typography>  
                            </Grid>
                        </Grid>
                           <Grid xs={12} spacing={2} item container>
                                <Grid xs={4} xl={3} item sx={{backgroundColor:''}}>
                                    <StyledInputField onChange={setMonthYear} value={monthYear} placeholder={"Year-Month, Ex: 22-04"} ariaLabel={"Year/Month"} style={{borderRadius:2}}/>    
                                </Grid>
                                <Grid xs={4} xl={3} item>
                                    <StyledInputField onChange={setWorkingDays} value={workingDays} placeholder={"Working Days"} ariaLabel={"Working Days"} style={{borderRadius:2}}/>
                                </Grid>
            
                                <Grid xs={4} xl={1.5} item>
                                    <StyledButton onClick= {handleSetWorkingDays} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>Update</StyledButton>
                                </Grid>
                           </Grid>
                           <Grid xs={12} spacing={2} item container>
                                <Grid xs={4} xl={3} item sx={{backgroundColor:''}}>
                                    <Typography 
                                        sx={{
                                            py:1,
                                            pl:3, 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start', 
                                            backgroundColor: 'white',
                                            fontSize:"14px",
                                            fontWeight:500,
                                            flex: 1, 
                                            color: 'black',  
                                            opacity: 1,
                                            borderRadius:2,
                                            border:'1px solid black'
                                            }}>
                                            {"Late Count Policy"}
                                    </Typography>
                                </Grid>
                                <Grid xs={4} xl={3} item>
                                    <StyledInputField onChange={setLateTime} value={lateTime} placeholder={"Time, Ex: 10:10"} ariaLabel={"Time"} style={{borderRadius:2}}/>
                                </Grid>
                                <Grid xs={4} xl={1.5} item>
                                    <StyledButton onClick= {handleSetLateTime} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>Update</StyledButton>
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
    activityStatus: state?.admin?.activityStatus,
    activityStatusOptions: state?.admin?.activityStatusOptions,
    department: state?.admin?.department,
    departmentOptions: state?.admin?.departmentOptions,
    contractType: state?.admin?.contractType,
    contractTypeOptions: state?.admin?.contractTypeOptions,
    designation: state?.admin?.designation,
    designationOptions: state?.admin?.designationOptions,
    newUserName: state?.admin?.newUserName,
    newUserEmail: state?.admin?.newUserEmail,
    newUserMobile:state?.admin?.newUserMobile,
    newUserRole: state?.admin?.newUserRole,
    newUserRoleOptions: state?.admin?.newUserRoleOptions,
    fileInput: state?.admin?.fileInput,
    announcementMessage: state?.admin?.announcementMessage,
    lateTime: state?.admin?.lateTime,
    monthYear: state?.admin?.monthYear,
    workingDays: state?.admin?.workingDays,
    companySettings: state?.admin?.companySettings
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)