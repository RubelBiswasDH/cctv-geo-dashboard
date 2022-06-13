import { createSlice } from '@reduxjs/toolkit'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../../utils/utils'
// import { attendanceWithAbsenceInfo } from '../../utils/attendanceUtils'

const initialState = {
    attendanceList: [],
    error: '',
    filterOptions: {},
    uniqueDates: [],
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
      state.uniqueDates = action.payload
    }
    
  }
})

export const { setAttendance, updateAttendance, setError, setFilterOptions, updateFilterOptions,setUniqueDates } = attendanceSlice.actions
export default attendanceSlice.reducer