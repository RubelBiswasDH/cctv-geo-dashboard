import { createSlice } from '@reduxjs/toolkit'
import {getCurrentView} from '../../utils/utils'

const currentView = getCurrentView()
const initialState = {
    currentView: currentView ?? 'attendance',
    toastIsOpen: false,
    toastMessage: '',
    toastSeverity: 'success',
    isNewUser: false
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload
    },
    setToastIsOpen: (state, action) => {
      state.toastIsOpen = action.payload
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    setToastSeverity: (state, action) => {
      state.toastSeverity = action.payload
    },
    setIsNewUser:  (state, action) => {
      state.isNewUser = action.payload
    }
  }
})

export const { setCurrentView, setToastIsOpen, setToastMessage, setToastSeverity, setIsNewUser } = dashboardSlice.actions
export default dashboardSlice.reducer