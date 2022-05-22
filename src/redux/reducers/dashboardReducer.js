import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentView: 'attendance',
    toastIsOpen: false,
    toastMessage: ''
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
    //console.log("action data: ",action, action.payload)
      state.currentView = action.payload
    },
    setToastIsOpen: (state, action) => {
      state.toastIsOpen = action.payload
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    
  }
})

export const { setCurrentView, setToastIsOpen, setToastMessage } = dashboardSlice.actions
export default dashboardSlice.reducer