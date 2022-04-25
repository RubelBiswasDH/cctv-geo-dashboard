import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  isValidating: false,
  employeeId: '',
  password: '',
  token: null,
  user: {},
  error: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    setIsValidating: (state, action) => {
      state.isValidating = action.payload
    },
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setIsAuthenticated, setIsValidating, setEmployeeId, setPassword, setToken, setUser, setError } = authSlice.actions
export default authSlice.reducer