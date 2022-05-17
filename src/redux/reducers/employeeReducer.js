import { createSlice } from '@reduxjs/toolkit'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../actions/taskActions'

const initialState = {
    employeeList: [],
    employee: {},
    error: ''
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployee: (state, action) => {
    //console.log("action data: ",action, action.payload)
      state.employee = action.payload
    },
    setEmployeeList: (state, action) => {
        //console.log("action data: ",action, action.payload)
          state.employeeList = action.payload
        },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setEmployee, setEmployeeList, setError } = employeeSlice.actions
export default employeeSlice.reducer