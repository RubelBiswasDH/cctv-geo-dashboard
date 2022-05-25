import axios from 'axios'
import { AUTH,API } from '../../App.config'

import { setAttendance, setError } from '../reducers/attendanceReducer'

// Get Attendance
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

// get reports

export function getAttendanceReport(params) {
    const token = getAuthToken();
    return dispatch => {
        axios.get(API.GET_ATTENDANCE_STATISTICS, { headers: { Authorization: `Bearer ${ token }` }, params } )
            .then(res => {
                //console.log("data , ",res.data )
                const type = res.headers['content-type']
                const blob = new Blob([res.data], { type: type, encoding: 'UTF-8' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'attendance_report.xlsx'
                link.click()

            })
            .catch(err => {
                //console.error(err)
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