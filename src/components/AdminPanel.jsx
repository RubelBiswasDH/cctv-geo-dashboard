import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Box, Grid, Typography, Paper, InputBase, Button, TextField, Autocomplete } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'
import StyledInputField from './common/StyledInputField'
import StyledButton from './common/StyledBotton'
import MapGL from '../components/common/MapGL'
import { getCompanyList } from '../redux/actions/registerActions'

import { setCompanyAddress, setCompanyLongitude, setCompanyLatitude } from '../redux/reducers/registerReducer'
import { setFileInput, setAnnouncementMessage, setLateTime, setWorkingDays, setMonthYear, updateNewUser, updateNewUserProfile, setCompanyAddressData, setCompanySettings } from '../redux/reducers/adminReducer'
import { createUser, createBulkUser, createNotice, getCompanySettingsAction, setCompanySettingsAction } from '../redux/actions/adminActions'
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../redux/reducers/dashboardReducer"
import dayjs from 'dayjs'

const UserField = (props) => {
    const { title, value, field, subField, dispatch, style, fieldStyle } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize: '18px',
    }
    const handleChange = e => {
        e.preventDefault()
        if (field === 'profile') {
            dispatch(updateNewUserProfile({
                [subField]: e.target.value
            }))
        }
        else {
            dispatch(updateNewUser({ [field]: e.target.value }))
        }

    }
    return (
        <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%' }}>
            <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-end',width:'30%'}}>
                <Typography sx={{ ...textStyle}}>{title}</Typography>
            </Box>
            <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'50%', ...fieldStyle }}>
                <Paper
                    xs={12}
                    sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000',width:'100%', border: '1px solid #000000', borderRadius: 1, ...style }}
                >   
                    
                    <InputBase
                        sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1 }}
                        inputProps={{ 'aria-label': { title }, color: '#000000' }}
                        value={value || ''}
                        onChange={handleChange}
                    />
                </Paper>
            </Box>
        </Grid>
    )
}

const CustomButton = (props) => {
    const { sx, name, currentTab } = props
    const btnStyle = {
        textTransform: 'none',
        borderRadius: '.8em',
        minWidth: '100%',
        background: 'transparent',
        border: '1px solid black',
    }

    const activeBtn = (currentTab === name) ? { background: '#ADD8E6' } : {}

    const handleClick = () => {
        props.onClick()
    }

    return (
        <Button onClick={handleClick} sx={{ ...btnStyle, ...activeBtn }} variant="contained" color="gray"><Typography sx={{ p: .5, pt: .75, fontSize: { xs: '.2em', sm: '.8em', md: '.8em', lg: '.8em', xl: '.8em' }, fontWeight: 400, color: 'black', ...sx }}>{props.children}</Typography></Button>
    );
}


const GridContent = (props) => {
    const { style, titleStyle } = props
    return (
        <Grid xs={12} item container sx={{ m: 0, mt: 2, p: 0, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '', ...style }}>
            <Typography sx={{ textAlign: 'center', width: '90%', fontSize: '1em', fontWeight: 600, background: '', pl: 0, pt: 2, ...titleStyle }}>{props.title}</Typography>
            {props.children}
        </Grid>
    )
}

class AdminPanel extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: 'notice',
            seeMore: false,
            data: {},
        }
        this.handleCreateUser = this.handleCreateUser.bind(this)
        this.handleFileInput = this.handleFileInput.bind(this)
        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.handleNotice = this.handleNotice.bind(this)
        this.handleSetLateTime = this.handleSetLateTime.bind(this)
        this.handleSetWorkingDays = this.handleSetWorkingDays.bind(this)
        this.updateExactAddress = this.updateExactAddress.bind(this)
    }
    componentDidMount() {
        this.props.dispatch(getCompanySettingsAction())
    }

    updateExactAddress = (updatedAddress) => {
        const { data } = this.state
        const { dispatch } = this.props
        const updatedDate = {
            ...data,
            exact_address: updatedAddress.exact_address,
            latitude: updatedAddress.latitude,
            longitude: updatedAddress.longitude
        }
        dispatch(setCompanyAddressData(updatedDate))
    }
    handleNewUserFieldChange = e => {

    }
    handleNotice = e => {
        e.preventDefault()
        const { dispatch, announcementMessage } = this.props
        const message = {
            message: announcementMessage,
        }
        if (announcementMessage) {
            dispatch(createNotice(message))
        }
        else {
            dispatch(setToastMessage('Notice field is empty'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    handleFileUpload = e => {
        e.preventDefault()
        const { dispatch, fileInput } = this.props
        const formData = new FormData();
        formData.append("users", fileInput)
        dispatch(createBulkUser(formData))
    }

    handleFileInput = e => {
        const { dispatch } = this.props
        e.preventDefault()
        const file = e.target.files[0]
        dispatch(setFileInput(file))
    }


    handleCreateUser = (e) => {
        e.preventDefault()
        const { dispatch, newUserName, newUserEmail, newUserMobile, newUserRole } = this.props
        const user = {
            name: newUserName,
            user_level: newUserRole,
            phone: newUserMobile,
            email: newUserEmail
        }
        if (newUserName && newUserMobile && newUserEmail && newUserRole) {
            dispatch(createUser(user))
        }
        else {
            dispatch(setToastMessage('All fields are required'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    handleSaveUser = e => {
        const { dispatch, newUser } = this.props
        if (newUser.name && newUser.phone && newUser.email) {
            dispatch(createUser(newUser))
        }
        else {
            dispatch(setToastMessage('Name,Phone and Email are mandatory fields'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }

    handleSetLateTime = (e) => {
        e.preventDefault()
        const { dispatch, lateTime, companySettings } = this.props
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
        const { dispatch, monthYear, workingDays, companySettings } = this.props
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
    handleSaveCompanyAddress = (e) => {
        e.preventDefault()
        const { dispatch, companySettings, companyAddressData } = this.props
        if (companyAddressData) {
            const new_settings = {
                companyAddressData: companySettings.companyAddressData
            }

            dispatch(setCompanySettingsAction({ ...companySettings, ...new_settings }))
        }
        else {
            dispatch(setToastMessage('Something went wrong, try again..'))
            dispatch(setToastIsOpen(true))
            dispatch(setToastSeverity('warning'))
        }
    }
    // handleAutoCompInputChange
    handleAutoCompInputChange = e => {
        const { dispatch } = this.props
        dispatch(getCompanyList(e.target.value))
    }

    // handleAutoCompChange
    handleAutoCompChange = (e, value) => {
        const { dispatch, companySettings } = this.props
        dispatch(setCompanyAddress(value?.Address ?? ''))
        dispatch(setCompanyAddressData(value?.Address ? {
            exact_address: value?.Address,
            longitude: value?.longitude,
            latitude: value?.latitude,
        } : {}))
        const newAddress = value?.Address ? {
            exact_address: value?.Address,
            longitude: value?.longitude,
            latitude: value?.latitude,
        } : {}
        dispatch(setCompanySettings({ ...companySettings, ...{ companyAddressData: newAddress } }))
        dispatch(setCompanyLongitude(value?.longitude ?? ''))
        dispatch(setCompanyLatitude(value?.latitude ?? ''))
    }

    render() {
        const { handleNotice, handleSetLateTime, handleSetWorkingDays, handleSaveUser, handleAutoCompInputChange, handleAutoCompChange, handleSaveCompanyAddress } = this
        const { dispatch, announcementMessage, lateTime, workingDays, monthYear, companySettings, companyNameOptions, newUser } = this.props
        const { currentTab } = this.state
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
                }
                )}
            >
                <Grid container spacing={0} sx={{ mt: 0, pl: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StyledAppBar title={'Admin Panel'} bgColor={'#FF6961'} style={{ borderRadius: '4px' }} />
                </Grid>
                <Grid container spacing={0} sx={{ mt: 1, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item container xs={12} spacing={2} sx={{ my: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid xs={2} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                            <CustomButton onClick={() => this.setState({ currentTab: "notice" })} style={{ borderRadius: 2, pt: 1, width: '100%' }} name={"notice"} currentTab={currentTab}>Notice</CustomButton>
                        </Grid>
                        <Grid xs={2} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                            <CustomButton onClick={() => this.setState({ currentTab: "add_user" })} style={{ borderRadius: 2, pt: 1, width: '100%' }} name={"add_user"} currentTab={currentTab}>Add User</CustomButton>
                        </Grid>
                        <Grid xs={2} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                            <CustomButton onClick={() => this.setState({ currentTab: "company_policy" })} style={{ borderRadius: 2, pt: 1, width: '100%' }} name={"company_policy"} currentTab={currentTab}>Company Policy</CustomButton>
                        </Grid>
                    </Grid>

                    {/*Notice*/}
                    {(this.state.currentTab === 'notice')
                        ? (
                            <GridContent title={"Notice"} style={{ flexDirection: 'column' }}>
                                <Grid item container columnSpacing={2} sx={{ p: 2, pt: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Grid xs={12} item sx={{ pb: 2, pl: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <StyledInputField onChange={setAnnouncementMessage} value={announcementMessage} placeholder={"Notice"} ariaLabel={"Notice"} style={{ borderRadius: 2, height: '8vh' }} />
                                    </Grid>
                                    <Grid xs={12} item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '' }}>
                                        <StyledButton onClick={handleNotice} variant="contained" style={{ borderRadius: 2, pt: 1, width: '10%' }}>Post</StyledButton>
                                    </Grid>
                                </Grid>
                            </GridContent>
                        ) : ''}


                    {/*Add User*/}
                    {(this.state.currentTab === 'add_user')
                        ? (
                            <GridContent title={"Add User"} titleStyle={{fontSize:'18px'}} style={{ p: 2 }}>
                                    { (this.state.seeMore) 
                                             &&   <StyledButton onClick={() => this.setState({seeMore:false})} variant="contained" style={{ borderRadius: 1, pt: .5, m:2,mt:0.5, width: '10%' }} btnColor={'btnGray'}>See Less</StyledButton>
                                             }
                                    <Grid xs={12} spacing={2} item container sx={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <UserField  dispatch={dispatch} field={'name'}  title={"Name"} value={newUser?.name} fieldStyle={{ width:'50%' }}/>
                                        <UserField  dispatch={dispatch} field={'email'}  title={"E: Mail"} value={newUser?.email} fieldStyle={{ width:'40%' }}/>
                                        <UserField  dispatch={dispatch} field={'phone'}  title={"Phone"} value={newUser?.phone} fieldStyle={{ width:'40%' }}/>
                                        <UserField  dispatch={dispatch} field={'profile'} subField={'designation'}  title={"Designation"} value={newUser?.profile?.designation} fieldStyle={{ width:'25%' }}/>
                                        {/* starblock */}
                                        { (this.state.seeMore) 
                                             && <>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'house_address'}  title={"House Address"} value={newUser?.profile?.house_address} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'birth_date'}  title={"Birth Date"} value={newUser?.profile?.birth_date} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'gender'}  title={"Gender"} value={newUser?.profile?.gender} fieldStyle={{ width:'25%' }}/>    
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'marritial_status'}  title={"Marritial Status"} value={newUser?.profile?.marritial_status} fieldStyle={{ width:'30%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'nid'}  title={"NID"} value={newUser?.profile?.nid} fieldStyle={{ width:'30%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'tin'}  title={"Tin"} value={newUser?.profile?.tin} fieldStyle={{ width:'30%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'educational_qualification'}  title={"Educational Qualification"} value={newUser?.profile?.educational_qualification} fieldStyle={{ width:'50%' }}/>

                                    <Typography sx={{fontSize:'22px', fontWeight:300,mt:2}}>Office Details</Typography>

                                    <UserField  dispatch={dispatch} field={'profile'} subField={'office_email'}  title={"Office Email"} value={newUser?.profile?.office_email} fieldStyle={{ width:'40%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'office_phone_no'}  title={"Office Phone No"} value={newUser?.profile?.office_phone_no} fieldStyle={{ width:'30%' }}/> 
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'job_status'}  title={"Job Status"} value={newUser?.profile?.job_status} fieldStyle={{ width:'25%' }}/> 
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'reporting_person'}  title={"Reporting Person"} value={newUser?.profile?.reporting_person} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'joining_data'}  title={"Joining Date"} value={newUser?.profile?.joining_data} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'end_of_probation'}  title={"End of Probation"} value={newUser?.profile?.end_of_probation} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'last_performance_review'}  title={"Last Performance Review"} value={newUser?.profile?.last_performance_review} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'next_performance_review'}  title={"Next Performance Review"} value={newUser?.profile?.next_performance_review} fieldStyle={{ width:'25%' }}/>

                                    <Typography sx={{fontSize:'22px', fontWeight:300,mt:2}}>Emergency</Typography>

                                    <UserField  dispatch={dispatch} field={'profile'} subField={'blood_group'}  title={"Blood Group"} value={newUser?.profile?.blood_group} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person'}  title={"Contact Person"} value={newUser?.profile?.contact_person} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'contact_person_no'}  title={"Contact Person No"} value={newUser?.profile?.contact_person_no} fieldStyle={{ width:'30%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'relationship_with_contact_perso'}  title={"Relationship with contact person"} value={newUser?.profile?.relationship_with_contact_perso} fieldStyle={{ width:'30%' }}/>

                                    <Typography sx={{fontSize:'22px', fontWeight:300,mt:2}}>Benefits</Typography>
                                    
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'salary'}  title={"Salary"} value={newUser?.profile?.salary} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'casual_leave'}  title={"Casual Leave"} value={newUser?.profile?.casual_leave} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'sick_leave'}  title={"Sick Leave"} value={newUser?.profile?.sick_leave} fieldStyle={{ width:'25%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'festival_bonus'}  title={"Fastival Bonus"} value={newUser?.profile?.festival_bonus} fieldStyle={{ width:'25%' }}/>

                                    <Typography sx={{fontSize:'22px', fontWeight:300,mt:2}}>Bank Account Details</Typography>

                                    <UserField  dispatch={dispatch} field={'profile'} subField={'account_title'}  title={"Account Title"} value={newUser?.profile?.account_title} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'account_no'}  title={"Account No"} value={newUser?.profile?.account_no} fieldStyle={{ width:'30%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'bank_name'}  title={"Bank Name"} value={newUser?.profile?.bank_name} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'branch_name'}  title={"Branch Name"} value={newUser?.profile?.branch_name} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'routing_no'}  title={"Routing No"} value={newUser?.profile?.routing_no} fieldStyle={{ width:'30%' }}/>

                                    <Typography sx={{fontSize:'22px', fontWeight:300,mt:2}}>Last Work Place</Typography>

                                    <UserField  dispatch={dispatch} field={'profile'} subField={'company_name'}  title={"Company Name"} value={newUser?.profile?.company_name} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'designation'}  title={"Designation"} value={newUser?.profile?.designation} fieldStyle={{ width:'40%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'responsibilities'}  title={"Responsibilities"} value={newUser?.profile?.responsibilities} fieldStyle={{ width:'50%' }}/>
                                    <UserField  dispatch={dispatch} field={'profile'} subField={'last_salary'}  title={"Salary"} value={newUser?.profile?.last_salary} fieldStyle={{ width:'25%' }}/>

                                </>}
                                        {/* endblock */}
                                        <Grid xs={12} xl={6} item sx={{display:'flex', justifyContent: 'center', alignItems: 'center', gap:2,width:'100%'}}>
                                            <StyledButton onClick={handleSaveUser} variant="contained" style={{ borderRadius: 2, pt: .5, width: '10%' }}>Save</StyledButton>
                                            { (!this.state.seeMore) 
                                             &&   <StyledButton onClick={() => this.setState({seeMore:true})} variant="contained" style={{ borderRadius: 1, pt: .5, width: '10%' }} btnColor={'btnGray'}>See More</StyledButton>
                                             }
                                        </Grid>
                                    {/* <Grid xs={12} item container spacing={2}>
                                        <Grid xs={4} item>
                                            <StyledButton href={downloadDemoCSV} sx={{ overflow: 'ellipsis' }} onClick={() => null} variant="contained" style={{ borderRadius: 2, pt: .5, width: '100%' }}>Demo CSV File Download</StyledButton>
                                        </Grid>
                                        <Grid xs={4} item>
                                            <InputButton onChange={handleFileInput}></InputButton>
                                        </Grid>
                                        <Grid xs={4} item>
                                            <StyledButton onClick={handleFileUpload} variant="contained" style={{ borderRadius: 2, pt: .5, width: '100%' }}>Upload</StyledButton>
                                        </Grid>
                                    </Grid> */}

                                </Grid>
                                {/* )
                    :( */}

                            </GridContent>
                        )
                        : ''}

                    {/*Company Settings*/}
                    {(this.state.currentTab === 'company_policy')
                        ? (
                            <GridContent title={"Company Settings"} >
                                <Grid container spacing={2} sx={{ p: 4, pt: 2 }}>
                                    <Grid xs={12} spacing={2} item container sx={{ p: 4, pt: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid xs={4} xl={3} item sx={{ backgroundColor: '' }}>
                                            <Typography
                                                sx={{
                                                    py: 1,
                                                    pl: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    backgroundColor: 'white',
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    flex: 1,
                                                    color: 'black',
                                                    opacity: 1,
                                                    borderRadius: 2,
                                                    border: '1px solid black'
                                                }}>
                                                {`Late Time: ${(companySettings && companySettings.late_time) ? companySettings.late_time : ""}`}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={4} xl={3} item>
                                            <Typography
                                                sx={{
                                                    py: 1,
                                                    pl: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    backgroundColor: 'white',
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    flex: 1,
                                                    color: 'black',
                                                    opacity: 1,
                                                    borderRadius: 2,
                                                    border: '1px solid black'
                                                }}>
                                                {`Working Days : ${(companySettings && companySettings.working_days) ? companySettings?.working_days[dayjs(new Date()).format('YYYY-MM').toString()] : ""}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} spacing={2} item container sx={{ p: 4, pt: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid xs={4} xl={3} item sx={{ backgroundColor: '' }}>
                                            <StyledInputField onChange={setMonthYear} value={monthYear} placeholder={"Year-Month, Ex: 2022-04"} ariaLabel={"Year/Month"} style={{ borderRadius: 2 }} />
                                        </Grid>
                                        <Grid xs={4} xl={3} item>
                                            <StyledInputField onChange={setWorkingDays} value={workingDays} placeholder={"Working Days"} ariaLabel={"Working Days"} style={{ borderRadius: 2 }} />
                                        </Grid>

                                        <Grid xs={4} xl={1.5} item>
                                            <StyledButton onClick={handleSetWorkingDays} variant="contained" style={{ borderRadius: 2, pt: .5, width: '100%' }}>Update</StyledButton>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} spacing={2} item container sx={{ p: 4, pt: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid xs={4} xl={3} item sx={{ backgroundColor: '' }}>
                                            <Typography
                                                sx={{
                                                    py: 1,
                                                    pl: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    backgroundColor: 'white',
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    flex: 1,
                                                    color: 'black',
                                                    opacity: 1,
                                                    borderRadius: 2,
                                                    border: '1px solid black'
                                                }}>
                                                {"Late Count Policy"}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={4} xl={3} item>
                                            <StyledInputField onChange={setLateTime} value={lateTime} placeholder={"Time, Ex: 10:10"} ariaLabel={"Time"} style={{ borderRadius: 2 }} />
                                        </Grid>
                                        <Grid xs={4} xl={1.5} item>
                                            <StyledButton onClick={handleSetLateTime} variant="contained" style={{ borderRadius: 2, pt: .5, width: '100%' }}>Update</StyledButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ p: 4, pt: 2 }}>
                                    <Grid xs={12} spacing={2} item container>
                                        <Grid xs={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontSize: '1.2em', fontWeight: 600 }}>Company Address</Typography>
                                        </Grid>
                                        <Grid xs={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontSize: '1em', fontWeight: 600 }}>Current Address : {companySettings?.companyAddressData?.exact_address}</Typography>
                                        </Grid>
                                        <Grid xs={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }} >
                                            <Paper
                                                variant='outlined'
                                                sx={{
                                                    width: '60%',
                                                    height: '100%',
                                                    p: 0,
                                                    m: 0,
                                                    position: 'relative'
                                                }}
                                            >
                                                <MapGL
                                                    markerData={(companySettings && companySettings?.companyAddressData) ? [companySettings?.companyAddressData
                                                    ] : []
                                                    }
                                                    getUpdatedAddress={this.updateExactAddress}
                                                />
                                                <Box sx={{ width: '20%', position: 'absolute', left: "3.2em", top: ".6em", background: 'white' }}>
                                                    <Autocomplete
                                                        onChange={handleAutoCompChange}
                                                        onInputChange={handleAutoCompInputChange}
                                                        disablePortal
                                                        id="companySearch"
                                                        options={companyNameOptions || []}
                                                        getOptionLabel={(option) => {
                                                            if (typeof option === 'string') {
                                                                return option;
                                                            }
                                                            if (option.inputValue) {
                                                                return option.inputValue;
                                                            }
                                                            return option.Address
                                                        }}
                                                        renderOption={(props, option) => (
                                                            <Grid container {...props} key={option.id} >
                                                                <Grid item xs={12}><Typography sx={{ fontSize: '1em' }}>{option.Address.split(',')[0]}</Typography></Grid>
                                                                <Grid item xs={12}><Typography>{option.Address}</Typography></Grid>
                                                            </Grid>)}
                                                        sx={{ width: '100%' }}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                {...params}
                                                                variant='outlined'
                                                                margin='none'
                                                                size='small'
                                                                fullWidth={true}
                                                                name='companyAddress'
                                                                type='text'
                                                                placeholder=''

                                                            />
                                                        }
                                                    />
                                                </Box>
                                            </Paper>

                                        </Grid>
                                        <Grid xs={12} xl={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
                                        </Grid>
                                        <Grid xs={12} xl={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
                                            <StyledButton onClick={handleSaveCompanyAddress} variant="contained" style={{ borderRadius: 2, pt: .5, width: '10%' }}>Save</StyledButton>
                                        </Grid>
                                        <Grid xs={12} xl={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </GridContent>
                        ) : ''}
                </Grid>
            </Box>
        );
    }
}

// Prop Types
AdminPanel.propTypes = {
    designation: PropTypes.string,
    designationOptions: PropTypes.array,
    newUserName: PropTypes.string,
    newUserEmail: PropTypes.string,
    newUserMobile: PropTypes.string,
    newUserRole: PropTypes.string,
    newUserRoleOptions: PropTypes.array,
    fileInput: PropTypes.object,
    announcementMessage: PropTypes.string,
    lateTime: PropTypes.string,
    monthYear: PropTypes.string,
    workingDays: PropTypes.string,
    companySettings: PropTypes.object,
    newUser: PropTypes.object,
    companyNameOptions: PropTypes.array,
    companyLatitude: PropTypes.string,
    companyLongitude: PropTypes.string,
    companyAddressData: PropTypes.object,
}

AdminPanel.defaultProps = {
    designation: '',
    designationOptions: [],
    newUserName: '',
    newUserEmail: '',
    newUserMobile: '',
    newUserRole: '',
    newUserRoleOptions: [],
    fileInput: {},
    announcementMessage: '',
    lateTime: '',
    monthYear: '',
    workingDays: '',
    companySettings: {},
    newUser: {},
    companyNameOptions: [],
    companyLatitude: '',
    companyLongitude: '',
    companyAddressData: {},
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
    newUserMobile: state?.admin?.newUserMobile,
    newUserRole: state?.admin?.newUserRole,
    newUserRoleOptions: state?.admin?.newUserRoleOptions,
    fileInput: state?.admin?.fileInput,
    announcementMessage: state?.admin?.announcementMessage,
    lateTime: state?.admin?.lateTime,
    monthYear: state?.admin?.monthYear,
    workingDays: state?.admin?.workingDays,
    companySettings: state?.admin?.companySettings,
    newUser: state?.admin?.newUser,
    companyNameOptions: state?.register?.companyNameOptions,
    companyLatitude: state?.register?.companyLatitude,
    companyLongitude: state?.register?.companyLongitude,
    companyAddressData: state?.admin?.companyAddressData,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)