import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    employeeList: [],
    employee: {},
    currentEmployeeType:'',
    error: ''
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployee: (state, action) => {
      state.employee = action.payload
    },
    setEmployeeList: (state, action) => {
          state.employeeList = action.payload
        },
    setError: (state, action) => {
      state.error = action.payload
    },
    setCurrentEmployeeType: ( state, action ) => {
      state.currentEmployeeType = action.payload
    }
  }
})

export const { setEmployee, setEmployeeList, setCurrentEmployeeType, setError } = employeeSlice.actions
export default employeeSlice.reducer