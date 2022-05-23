import axios from 'axios'
import { API } from '../../App.config'
import { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError } from '../reducers/registerReducer'
import {setUserProfile, setProfileEdit, setCompanySettings, setNewUserName, setNewUserEmail, setNewUserMobile, setNewUserRole, setAnnouncementMessage, setLateTime, setMonthYear, setWorkingDays} from '../reducers/adminReducer';
import { setToastIsOpen, setToastMessage, setToastSeverity } from '../reducers/dashboardReducer';
import {getEmployee}  from '../actions/employeeActions'

// getCompanySettingsAction

export function getCompanySettingsAction() {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`

        //console.log('token: ',token)
        axios.get(API.GET_COMPANY_SETTINGS, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                // console.log('res: ', res)
                const data = res.data;
                    // console.log({ SETTING_res : data})
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
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        axios.post(API.SET_COMPANY_SETTINGS, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                // console.log({ update_user_response: res.data})
                if(res.status===200){
                    dispatch(getCompanySettingsAction())
                    // alert("Company Setting Successfully Updated")
                    dispatch(setMonthYear(''))
                    dispatch(setWorkingDays(''))
                    dispatch(setLateTime(''))
                    dispatch(setToastMessage("Settings Successfully Updated"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                }
                //console.log('res :', res)
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
                    // getUserProfile(id)
                    // dispatch(setProfileEdit(false))
                    alert("Working Days Successfully Updated")
                    dispatch(setMonthYear(''))
                    dispatch(setWorkingDays(''))
                    dispatch(setLateTime(''))
                }
                //console.log('res :', res)
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
                // console.log({ update_user_response: res.data})
                if(res.status===200){
                    // getUserProfile(id)
                    // dispatch(setProfileEdit(false))
                    // alert("Late Successfully Updated")
                   
                }
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}
// Get User Profile
export function getUserProfile(user_id) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`
       // dispatch( setIsValidating(true) )
        // console.log('user_id in actions ',user_id)
        //console.log('token: ',token)
        axios.get(API.GET_USER_PROFILE+user_id, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                const data = res.data.data;
                // console.log({ user__response: data})
                dispatch(setUserProfile({...data,user_id:user_id}))
              
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// setUserProfile Action
export function setUserProfileAction(id,data) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValdataating`
       // dispatch( setIsValdataating(true) )
        // console.log('user in actions ',data)
        //console.log('token: ',token)
        axios.post(API.SET_USER_PROFILE+id, data, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                // console.log({ update_user_response: res.data})
                if(res.status===200){
                    // getUserProfile(id)
                    dispatch(getEmployee())
                    dispatch(setProfileEdit(false))
                    dispatch(setToastMessage("User Profile Successfully Updated"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                    // alert("User Successfully Updated")
                }
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create User Action
export function createUser(user) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`
       // dispatch( setIsValidating(true) )
        // console.log('user in actions ',user)
        //console.log('token: ',token)
        axios.post(API.CREATE_USER, user, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                // console.log({ create_user_response: res.data})
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
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create Bulk User
export function createBulkUser(data) {
    //console.log('user: ',user)
    return dispatch => {
        for(var pair of data) {
            console.log('f ; ', pair);
        }
        // console.log("Data : ", data[1])
        const token = getAuthToken()
        console.log(' users data in actions ',data)
        //console.log('token: ',token)
        axios.post(API.CREATE_BULK_USER, {'users':data}, { 
            headers: { 
                Authorization: `Bearer ${ token }`, 
                'Content-Type': 'multipart/form-data',
                // Accept:'application/octet-stream',
                // 'Access-Control-Allow-Origin': '*',

                }
            // params:{users:file} 
        })
            .then(res => {
                console.log({ create_user_response: res.data})
                if(res.status===200){
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastMessage("User Successfully Created"))
                    dispatch(setToastIsOpen(true))
                }
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create User Action
export function createNotice(notice) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`
       // dispatch( setIsValidating(true) )
        console.log('notice in actions ',notice)
        //console.log('token: ',token)
        axios.post(API.SEND_ANNOUNCEMENT, notice, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                // console.log({ notice_response: res.data})
                if(res.status===200){

                    dispatch(setToastMessage("Notice Successfully Send"))
                    dispatch(setToastSeverity('success'))
                    dispatch(setToastIsOpen(true))
                    dispatch(setAnnouncementMessage(''))
                }
                //console.log('res :', res)
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