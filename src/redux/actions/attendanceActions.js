import axios from 'axios'
import { API } from '../../App.config'
import { setAttendance, setError } from '../reducers/attendanceReducer'
import { attendanceWithAbsenceInfo } from '../../utils/attendanceUtils'
// Get Attendance
export function getAttendance(params) {
    const token = getAuthToken();
    return dispatch => {

        axios.get(API.GET_ALL_ATTENDANCE, { headers: { Authorization: `Bearer ${ token }` }, params } )
            .then(res => {
                const attendanceData = res.data
                if(attendanceData) {  

                    const attendence = attendanceData.attendence
                    dispatch(setAttendance(attendence))
                }
            })
            .catch(err => {
                dispatch( setAttendance([]) )
                dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )

            })
    }
}

export function getAttendanceReport(params) {
    const token = getAuthToken()
    const exportParams = `?token=${token}&start_date=${params.start_date}&end_date=${params.end_date}`
    const exportURL = API.GET_ATTENDANCE_STATISTICS + exportParams
    const newWindow = window.open(exportURL, '_blank', 'noopener,noreferrer')

    if (newWindow) newWindow.opener = null
}

// Get User Auth Token
export function getAuthToken() {
    const token = localStorage.getItem('token')
    if(token) {
        return token
    }
    return null
}