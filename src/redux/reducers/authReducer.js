import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  isValidating: false,
  employeeEmail: '',
  passwordResetEmail: '',
  newPassword:'',
  newPassword_2: '',
  password: '',
  token: null,
  passwordResetToken: null,
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
    setEmployeeEmail: (state, action) => {
      state.employeeEmail = action.payload
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
    },
    setPasswordResetEmail: (state, action) => {
      state.passwordResetEmail = action.payload
    },
    setNewPassword: (state, action) => {
      state.newPassword = action.payload
    },
    setNewPassword_2: (state, action) => {
      state.newPassword_2 = action.payload
    },
    setPasswordResetToken: (state, action ) => {
      state.passwordResetToken = action.payload
    }
  }
})

export const { setIsAuthenticated, setIsValidating, setEmployeeEmail, setPassword, setToken, setUser, setError, setPasswordResetEmail, setNewPassword, setNewPassword_2, setPasswordResetToken  } = authSlice.actions
export default authSlice.reducer