import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isValidating: false,
  employeeEmail: '',
  password: '',
  token: null,
  user: {},
  error: ''
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {

    setIsValidating: (state, action) => {
      state.isValidating = action.payload
    },
    setEmployeeEmail: (state, action) => {
      state.employeeEmail = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setIsValidating, setEmployeeEmail, setPassword, setError } = registerSlice.actions
export default registerSlice.reducer