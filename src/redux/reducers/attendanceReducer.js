import { createSlice } from '@reduxjs/toolkit'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../../utils/utils'

const initialState = {
    attendanceList: [],
    error: ''
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendance: (state, action) => {
    //console.log("action data: ",action, action.payload)
      state.attendanceList = sortByDate(action.payload)
    },
    updateAttendance: (state, action) => {
      console.log("state in store attendanceList ", action.payload)
      state.attendanceList = sortByDate(unionArrayOfObjects(state.attendanceList, action.payload, 'id'))
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setAttendance, updateAttendance, setError } = attendanceSlice.actions
export default attendanceSlice.reducer