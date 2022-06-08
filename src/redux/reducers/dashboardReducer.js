import { createSlice } from '@reduxjs/toolkit'
import {getCurrentView} from '../../utils/utils'

const currentView = getCurrentView()
const initialState = {
    currentView: currentView,
    toastIsOpen: false,
    toastMessage: '',
    toastSeverity: 'success'
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
    }
    
  }
})

export const { setCurrentView, setToastIsOpen, setToastMessage, setToastSeverity } = dashboardSlice.actions
export default dashboardSlice.reducer