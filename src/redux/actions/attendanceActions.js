import axios from 'axios'
import { AUTH,API } from '../../App.config'

import { setAttendance, setError } from '../reducers/attendanceReducer'

// User Validation
export function getAttendance(params) {
    const token = getAuthToken();
    //console.log('token on get Attendance: ', token)
    //console.log({ token })
    return dispatch => {
        // Set `isValidating`
        // dispatch( setIsValidating(true) )

        axios.get(API.GET_ALL_ATTENDANCE, { headers: { Authorization: `Bearer ${ token }` }, params } )
            .then(res => {
                //console.log("data , ",res.data )
                const attendanceData = res.data
                if(attendanceData) {
                   
                    // console.log(" attendance data : ",attendanceData)
                    // console.log(" attendance data : ",attendanceData.attendence)          
                    //console.log(" attendance data : ",attendanceData.attendence)          
                    dispatch(setAttendance(attendanceData.attendence))
                    //console.log('attendance setted')
                    // Dispatch authReducer Values to Redux State
                 


                }

                // Set `isValidating`
    

            })
            .catch(err => {
                //console.log("error on attendance: ",err)
                //console.error(err)

                dispatch( setAttendance([]) )
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