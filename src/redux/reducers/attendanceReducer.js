import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    attendanceList: [],
    error: ''
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendance: (state, action) => {
    console.log("action data: ",action, action.payload)
      state.attendanceList = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setAttendance, setError } = attendanceSlice.actions
export default attendanceSlice.reducer