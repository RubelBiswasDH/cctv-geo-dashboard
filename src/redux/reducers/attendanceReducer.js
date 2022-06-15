import { createSlice } from '@reduxjs/toolkit'
// import { attendanceWithAbsenceInfo } from '../../utils/attendanceUtils'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate, sortDates } from '../../utils/utils'


const initialState = {
    attendanceList: [],
    error: '',
    filterOptions: {},
    uniqueDates: [],
    currentAttendanceTab: 'Daily',
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendance: (state, action) => {
      state.attendanceList = sortByDate(action.payload)
    },
    updateAttendance: (state, action) => {
      state.attendanceList = sortByDate(unionArrayOfObjects(state.attendanceList, action.payload, 'id'))
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilterOptions: (state, action) => {
      state.filterOptions = action.payload
    },
    updateFilterOptions: (state, action) => {
      state.filterOptions = {...state.filterOptions, ...action.payload}
    },
    setUniqueDates: ( state, action ) => {
      state.uniqueDates = sortDates(action.payload)
    },
    setCurrentAttendanceTab: ( state, action ) => {
      state.currentAttendanceTab = action.payload
    }
    
  }
})

export const { setAttendance, updateAttendance, setError, setFilterOptions, updateFilterOptions, setUniqueDates, setCurrentAttendanceTab } = attendanceSlice.actions
export default attendanceSlice.reducer