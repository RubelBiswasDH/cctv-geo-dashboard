import axios from 'axios'
import { API } from '../../App.config'
import {setUserProfile, setProfileEdit, setCompanySettings, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setAnnouncementMessage, setLateTime, setMonthYear, setWorkingDays} from '../reducers/adminReducer';
import { setToastIsOpen, setToastMessage, setToastSeverity } from '../reducers/dashboardReducer';
import {getEmployee}  from '../actions/employeeActions'
import { getAttendance } from './attendanceActions';
import dayjs from 'dayjs'
// setUserProfile Action
export function setInvalidLateAttendanceAction(data) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        let date = new Date()
      
        const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
        const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    
        // Load Tasks
        axios.post(API.INVALID_LATE_ATTENDANCE, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){
                    dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
                    dispatch(setToastMessage(res.data.message))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}


// getCompanySettingsAction

export function getCompanySettingsAction() {
    return dispatch => {
        const token = getAuthToken()
        axios.get(API.GET_COMPANY_SETTINGS, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                const data = res.data;
                if(res.status===200){
                    dispatch(setCompanySettings(data))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}


// setCompanySettingsAction
export function setCompanySettingsAction(data) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SET_COMPANY_SETTINGS, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){
                    dispatch(getCompanySettingsAction())
                    dispatch(setMonthYear(''))
                    dispatch(setWorkingDays(''))
                    dispatch(setLateTime(''))
                    dispatch(setToastMessage("Settings Successfully Updated"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// setWorkingDaysAction
export function setWorkingDaysAction(data) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SET_WORKING_DAYS, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                console.log({ response: res})
                if(res.status===200){
                    alert("Working Days Successfully Updated")
                    dispatch(setMonthYear(''))
                    dispatch(setWorkingDays(''))
                    dispatch(setLateTime(''))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// setLateTimeAction
export function setLateTimeAction(data) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SET_LATE_TIME, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){
                   
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}
// Get User Profile
export function getUserProfile(user_id) {
    return dispatch => {
        const token = getAuthToken()
        axios.get(API.GET_USER_PROFILE+user_id, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                const data = res.data.data;
                dispatch(setUserProfile({...data,user_id:user_id}))
              
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// setUserProfile Action
export function setUserProfileAction(id,data) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SET_USER_PROFILE+id, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){
                    dispatch(getEmployee())
                    dispatch(setProfileEdit(false))
                    dispatch(setToastMessage("User Profile Successfully Updated"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create User Action
export function createUser(user) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.CREATE_USER, user, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){
                    dispatch(getEmployee())
                    dispatch(setToastMessage("User Successfully Created"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                    dispatch(setNewUserEmail(''))
                    dispatch(setNewUserName(''))
                    dispatch(setNewUserMobile(''))
                    dispatch(setNewUserRole('GENERAL'))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create Bulk User
export function createBulkUser(data) {
    return dispatch => {
        for(var pair of data) {
            console.log('f ; ', pair);
        }
        const token = getAuthToken()
        console.log(' users data in actions ',data)
        axios.post(API.CREATE_BULK_USER, {'users':data}, { 
            headers: { 
                Authorization: `Bearer ${ token }`, 
                'Content-Type': 'multipart/form-data',

                } 
        })
            .then(res => {
                console.log({ create_user_response: res.data})
                if(res.status===200){
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastMessage("User Successfully Created"))
                    dispatch(setToastIsOpen(true))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create User Action
export function createNotice(notice) {
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SEND_ANNOUNCEMENT, notice, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                if(res.status===200){

                    dispatch(setToastMessage("Notice Successfully Send"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                    dispatch(setAnnouncementMessage(''))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export function getAuthToken() {
    const token = localStorage.getItem('token')
    if(token) {
        return token
    }

    return null
}