import axios from 'axios'
import { API } from '../../App.config'

import { setEmployeeList, setError } from '../reducers/employeeReducer'
import { getAuthToken } from '../../utils/utils'

// GET List of Employee
export function getEmployee(params) {
    return dispatch => {
        const token = getAuthToken();
        axios.get(API.GET_USERS, { headers: { Authorization: `Bearer ${token}` }, params })
            .then(res => {
                const employeeData = res.data.data
                if (employeeData) {
                    dispatch(setEmployeeList(employeeData))
                }
            })
            .catch(err => {
                dispatch(setEmployeeList([]))
                dispatch(setError(err?.response?.data?.message ?? err?.message ?? ''))
            })
    }
}

