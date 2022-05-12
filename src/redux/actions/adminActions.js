import axios from 'axios'
import { API } from '../../App.config'
import { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError  } from '../reducers/registerReducer'

// Create User Action
export function createUser(user) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`
       // dispatch( setIsValidating(true) )
        console.log('user in actions ',user)
        //console.log('token: ',token)
        axios.post(API.CREATE_USER, user, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                console.log({ create_user_response: res.data})
                if(res.status===200){

                    alert("User Successfully Created")
                }
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

// Create Bulk User
export function createBulkUser(file) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        console.log('user in actions ',file)
        //console.log('token: ',token)
        axios.post(API.CREATE_BULK_USER,file, { 
            headers: { 
                Authorization: `Bearer ${ token }`, 
                'Content-Type': 'multipart/form-data',
                Accept:'application/octet-stream',
                // 'Access-Control-Allow-Origin': '*',

                },
            // params:{users:file} 
        })
            .then(res => {
                console.log({ create_user_response: res.data})
                if(res.status===200){
                    alert("User Successfully Created")
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
                console.log({ notice_response: res.data})
                if(res.status===200){

                    alert("Notice Successfully Send")
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