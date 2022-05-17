import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentView: 'attendance',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
    //console.log("action data: ",action, action.payload)
      state.currentView = action.payload
    },

  }
})

export const { setCurrentView } = dashboardSlice.actions
export default dashboardSlice.reducer