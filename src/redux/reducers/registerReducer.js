import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isValidating: false,
  employeeName: '',
  employeeEmail: '',
  employeePhone: '',
  companyName: '',
  password: '',
  error: ''
}

const registerSlice = createSlice({
  name: 'register',
  initialState:initialState,
  reducers: {

    setIsValidating: (state, action) => {
      state.isValidating = action.payload
    },
    setEmployeeName: (state, action) => {
      state.employeeName = action.payload
    },
    setEmployeeEmail: (state, action) => {
      state.employeeEmail = action.payload
    },
    setEmployeePhone: (state, action) => {
      state.employeePhone = action.payload
    },
    setCompanayName: (state, action) => {
      state.companyName = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError } = registerSlice.actions
export default registerSlice.reducer