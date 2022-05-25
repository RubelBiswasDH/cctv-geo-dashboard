import React from 'react'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase, Button, ButtonBase, TextField} from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import StyledSelect from './common/StyledSelect'

import downloadDemoCSV from '../assets/demo_users.xlsx'
import { setActivityStatus,setDepartment, setContractType, setdesignation, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setFileInput,setAnnouncementMessage,setLateTime, setWorkingDays, setMonthYear, updateCompanySettings, setNewUser, updateNewUser,updateNewUserProfile } from '../redux/reducers/adminReducer'
import { createUser, createBulkUser, createNotice, setLateTimeAction, setWorkingDaysAction, getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"
import dayjs from 'dayjs'

const UserField = (props) => {
    const {title, value, field, subField, dispatch, style} = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize:'12px',
    }
    const handleChange = e => {
        e.preventDefault()
        if(field === 'profile'){
            dispatch(updateNewUserProfile({
               [subField]: e.target.value
        }))
        }
        else{
            dispatch(updateNewUser({[field]: e.target.value}))
        }
        
    }
    return (
        <Grid xs={2.2} item >
            <Paper
                xs={12}
                sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000', border:'1px solid #000000', borderRadius:2, ...style }}
            >
                <InputBase
                    sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1 }}
                    placeholder={title}
                    inputProps={{ 'aria-label': {title}, color: '#000000' }}
                    value={value||''}
                    onChange={handleChange}
                />
            </Paper>
        </Grid>
    )
}

const CustomButton = (props) => {
    const {sx, name, currentTab} = props
    const btnStyle = {
        textTransform:'none',
        borderRadius: '.8em',
        minWidth:'100%',
        background:'transparent',
        border: '1px solid black',
    }

    const activeBtn = (currentTab === name)? {background:'#ADD8E6'}:{}

    const handleClick = () => {
        props.onClick()
        // setBtnStyle(pre => ({...pre, background:'green'}))
    }

    return (
        <Button onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="gray"><Typography sx={{p:.5,pt:.75, fontSize:{xs:'.5em', sm:'.4em',md:'.5em',lg:'.6em',xl:'.8em'},fontWeight:400,color:'black', ...sx}}>{props.children}</Typography></Button>
    );
}


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
                        color: '#fff',
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
    <Grid xs={12} item container sx={{m:0,mt:2,p:0,borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',flexDirection:'column',background:'',...style}}>
        <Typography sx={{textAlign:'center',width:'90%',fontSize:'1em',fontWeight:600,background:'',pl:0,pt:2}}>{props.title}</Typography>
        {props.children}
    </Grid>
        )
}

class AdminPanel extends React.PureComponent{
    constructor(props){
        super(props)
        this.state = {
            currentTab: 'notice',
            seeMore:false
        }
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
    handleNewUserFieldChange = e => {

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

    handleSaveUser = e => {
        const {dispatch, newUser} = this.props
        if(newUser.name && newUser.phone&& newUser.email){
            // console.log('all field filled')
            dispatch(createUser(newUser))
            // console.log('dispatch createUser',dispatch,createUser)
            // console.log('dipatch create user')
        }
        else{ 
            dispatch(setToastMessage('Name,Phone and Email are mandatory fields'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
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
                "working_days": {
                    ...companySettings.working_days,
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
    //         "working_days": {
    //             ...companySettings.working_days,
    //             [monthYear]:workingDays,
    //         },
           
    //         late_time: lateTime
    //     }
    
    //     dispatch(setCompanySettingsAction({...companySettings,...new_settings}))
    // }

    render(){
        const {handleCreateUser,handleFileInput, handleFileUpload, handleNotice, handleSetLateTime, handleSetWorkingDays, handleSaveUser} = this
        const {dispatch, activityStatus, activityStatusOptions, department, departmentOptions, contractType, contractTypeOptions, designation, designationOptions, newUserName, newUserEmail, newUserMobile, newUserRole, newUserRoleOptions, announcementMessage, lateTime, workingDays, monthYear, companySettings, newUser} = this.props
        const {currentTab} = this.state
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
                <Grid container spacing={0} sx={{mt:0,pl:1,display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'}  style={{borderRadius: '4px'}} />
                </Grid>
                <Grid container spacing={0} sx={{mt:1,px:4,display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Grid item container xs={12} spacing={2} sx={{my:1, display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Grid xs={2} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                            <CustomButton onClick={() => this.setState({currentTab:"notice"})} style={{borderRadius:2,pt:1,width:'100%'}} name={"notice"} currentTab ={currentTab}>Notice</CustomButton>
                        </Grid>
                        <Grid xs={2} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                            <CustomButton onClick={() => this.setState({currentTab:"add_user"})} style={{borderRadius:2,pt:1,width:'100%'}} name={"add_user"} currentTab ={currentTab}>Add User</CustomButton>
                        </Grid>
                        <Grid xs={2} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                            <CustomButton onClick={() => this.setState({currentTab:"company_policy"})} style={{borderRadius:2,pt:1,width:'100%'}} name={"company_policy"} currentTab ={currentTab}>Company Policy</CustomButton>
                        </Grid>
                    </Grid>
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
                    {(this.state.currentTab === 'notice')
                    ?(
                    <GridContent title={"Notice"}  style={{flexDirection:'column'}}>
                        <Grid item container columnSpacing={2} sx={{p:2,pt:2,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                            <Grid xs={12} item sx={{pb:2,pl:10,justifyContent:'center',alignItems:'center'}}>
                                <StyledInputField onChange={setAnnouncementMessage} value={announcementMessage} placeholder={"Notice"} ariaLabel={"Notice"} style={{borderRadius:2,height:'8vh'}}/>
                            </Grid>
                            <Grid xs={12} item sx={{display:'flex',justifyContent:'center',alignItems:'center', background:''}}>
                                <StyledButton onClick={handleNotice} variant="contained" style={{borderRadius:2,pt:1,width:'10%'}}>Post</StyledButton>
                            </Grid>
                        </Grid>
                    </GridContent>
                    ):''}
                   

                    {/*Add User*/}
                    {(this.state.currentTab === 'add_user')
                    ?(
                    <GridContent title={"Add User"} style={{p:1}}>
                        {(!this.state.seeMore)?(
                        <Grid container spacing={2} sx={{p:4,pt:2,background:''}}>
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
                                <Grid xs={4} xl={1.5} item>
                                    <StyledButton onClick= {() => this.setState(state => ({seeMore:!state.seeMore}))} variant="contained" style={{borderRadius:2,pt:.5,width:'100%'}}>See More</StyledButton>
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
                    )
                    :(
                        <Grid container spacing={2} sx={{p:4,pt:2}}>
                            
                                <Grid spacing={2} container item >
                                    <UserField  dispatch={dispatch} field={'name'}  title={"Name"} value={newUser?.name}/>
                                    <UserField  dispatch={dispatch} field={'email'}  title={"E: Mail"} value={newUser?.email}/>
                                    <UserField  dispatch={dispatch} field={'phone'}  title={"Phone"} value={newUser?.phone}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'designation'}  title={"Designation"} value={newUser?.profile?.designation}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'house_address'}  title={"House Address"} value={newUser?.profile?.house_address}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'birth_date'}  title={"Birth Date"} value={newUser?.profile?.birth_date}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'gender'}  title={"Gender"} value={newUser?.profile?.gender}/>    
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'marritial_status'}  title={"Marritial Status"} value={newUser?.profile?.marritial_status}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'nid'}  title={"NID"} value={newUser?.profile?.nid}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'tin'}  title={"Tin"} value={newUser?.profile?.tin}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'educational_qualification'}  title={"Educational Qualification"} value={newUser?.profile?.educational_qualification}/>
                                </Grid>
                                <Grid spacing={2} container item sx={{pl:0,ml:2,mt:0}} >
                                    <Typography sx={{fontSize:'1em', fontWeight:600}}>Office Details</Typography>
                                </Grid>
                                   
                                <Grid spacing={2} container item >
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'office_email'}  title={"Office Email"} value={newUser?.profile?.office_email}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'office_phone_no'}  title={"Office Phone No"} value={newUser?.profile?.office_phone_no}/> 
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'job_status'}  title={"Job Status"} value={newUser?.profile?.job_status}/> 
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'reporting_person'}  title={"Reporting Person"} value={newUser?.profile?.reporting_person}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'joining_data'}  title={"Joining Date"} value={newUser?.profile?.joining_data}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'end_of_probation'}  title={"End of Probation"} value={newUser?.profile?.end_of_probation}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'last_performance_review'}  title={"Last Performance Review"} value={newUser?.profile?.last_performance_review}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'next_performance_review'}  title={"Next Performance Review"} value={newUser?.profile?.next_performance_review}/>
                                </Grid>
                                <Grid spacing={2} container item sx={{pl:0,ml:2,mt:0}} >
                                    <Typography sx={{fontSize:'1em', fontWeight:600}}>Emergency</Typography>
                                </Grid>
                                    
                                <Grid spacing={2} container item >
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'blood_group'}  title={"Blood Group"} value={newUser?.profile?.blood_group}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person'}  title={"Contact Person"} value={newUser?.profile?.contact_person}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person_no'}  title={"Contact Person No"} value={newUser?.profile?.contact_person_no}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'relationship_with_contact_perso'}  title={"Relationship with contact person"} value={newUser?.profile?.relationship_with_contact_perso}/>
                                </Grid>
                                <Grid spacing={2} container item sx={{pl:0,ml:2,mt:0}} >
                                    <Typography sx={{fontSize:'1em', fontWeight:600}}>Benefits</Typography>
                                </Grid>
                                <Grid spacing={2} container item >
                                    
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'salary'}  title={"Salary"} value={newUser?.profile?.salary}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'casual_leave'}  title={"Casual Leave"} value={newUser?.profile?.casual_leave}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'sick_leave'}  title={"Sick Leave"} value={newUser?.profile?.sick_leave}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'festival_bonus'}  title={"Fastival Bonus"} value={newUser?.profile?.festival_bonus}/>
                                </Grid>
                                <Grid spacing={2} container item sx={{pl:0,ml:2,mt:0}} >
                                    <Typography sx={{fontSize:'1em', fontWeight:600}}>Bank Account Details</Typography>
                                </Grid>
                                    
                                <Grid spacing={2} container item >
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'account_title'}  title={"Account"} value={newUser?.profile?.account_title}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'account_no'}  title={"Account No"} value={newUser?.profile?.account_no}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'bank_name'}  title={"Bank Name"} value={newUser?.profile?.bank_name}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'branch_name'}  title={"Branch Name"} value={newUser?.profile?.branch_name}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'routing_no'}  title={"Routing No"} value={newUser?.profile?.routing_no}/>
                                </Grid>
                                <Grid spacing={2} container item sx={{pl:0,ml:2,mt:0}} >
                                    <Typography sx={{fontSize:'1em', fontWeight:600}}>Last Work Place</Typography>
                                </Grid>
                                   
                                <Grid spacing={2} container item >
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'company_name'}  title={"Company Name"} value={newUser?.profile?.company_name}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'designation'}  title={"Designation"} value={newUser?.profile?.designation}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'responsibilities'}  title={"Responsibilities"} value={newUser?.profile?.responsibilities}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'last_salary'}  title={"Salary"} value={newUser?.profile?.last_salary}/>
                                </Grid>
                                <Grid spacing={2} container sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,mt:2}}>
                                    <StyledButton href={downloadDemoCSV} onClick= {() => null} variant="contained" style={{borderRadius:2,pt:.5,width:'20%'}}>Download Demo CSV File</StyledButton>
                                </Grid>
                                <Grid spacing={2} container sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,mt:2}}>
                                    <StyledButton onClick= {handleSaveUser} variant="contained" style={{borderRadius:2,pt:.5,width:'10%'}}>Save</StyledButton>
                                    <StyledButton onClick= {() => this.setState(state => ({seeMore:!state.seeMore}))} variant="contained" style={{borderRadius:2,pt:.5,width:'10%'}}>See Less</StyledButton>
                                </Grid>
                        </Grid>
                    )}
                    </GridContent>
                     )
                     :''}

                    {/*Company Settings*/}
                    {(this.state.currentTab === 'company_policy')
                    ?(
                    <GridContent title={"Company Settings"} >
                    <Grid container spacing={2} sx={{p:4,pt:2,background:''}}>
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
                                            {`Working Days : ${(companySettings && companySettings.working_days)?companySettings?.working_days[dayjs(new Date()).format('YYYY-MM').toString()]:""}`}
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
                     ):''}
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
    companySettings: state?.admin?.companySettings,
    newUser:state?.admin?.newUser
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)