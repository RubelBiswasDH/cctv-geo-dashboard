import axios from 'axios'
import { AUTH,API } from '../../App.config'

import { setEmployeeList, setError } from '../reducers/employeeReducer'


// GET List of Employee
export function getEmployee(params) {
    const token = getAuthToken();
    //console.log({ token })
    return dispatch => {
        axios.get(API.GET_USERS, { headers: { Authorization: `Bearer ${ token }` }, params } )
            .then(res => {
                //console.log("data , ",res.data )
                const employeeData = res.data.data
                if(employeeData) {
                   
                    // console.log({employeeData})         
                    dispatch(setEmployeeList(employeeData))
                 
                }

            })
            .catch(err => {
                dispatch( setEmployeeList([]) )
                dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )
            })
    }
}


///////////////
// Utilities //
///////////////
// Get User Auth Token
export function getAuthToken() {
    const token = localStorage.getItem('token')
    if(token) {
        return token
    }
    return null
}