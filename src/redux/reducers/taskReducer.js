import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../actions/taskActions'

const initialState = {
  isTaskLoading: false,
  tasks: [],
  pushNotifications: [],
  threadMessages: [],
  selectedStatus: 'ALL',
  selectedDate: dayjs().format('YYYY-MM-DD'),
  ticketTimeline: [],
  sndList: [],
  searchQuery: '',
  autocompleteSelectedTask: null,
  isTaskThreadOpen: true,
  error: '',
  queryCategory: [],
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setIsTaskLoading: (state, action) => {
      state.isTaskLoading = action.payload
    },
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    updateTasks: (state, action) => {
      state.tasks = sortByDate(unionArrayOfObjects(state.tasks, action.payload, 'id'))
    },
    setPushNotifications: (state, action) => {
      state.pushNotifications = action.payload
    },
    updatePushNotifications: (state, action) => {
      state.pushNotifications = [ ...action.payload, ...state.pushNotifications ]
    },
    updatePushNotification: (state, action) => {
      const index = state.pushNotifications.findIndex(n => n.id === action.payload.id)
      if(index < 0) {
        return
      }

      state.pushNotifications[index] = { ...state.pushNotifications[index], ...action.payload }
    },
    setThreadMessages: (state, action) => {
      state.threadMessages = action.payload
    },
    updateThreadMessages: (state, action) => {
      state.threadMessages = [ ...state.threadMessages, ...action.payload ]
    },
    setSelectedStatusType: (state, action) => {
      state.selectedStatus = action.payload
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    setTicketTimeline: (state, action) => {
      state.ticketTimeline = action.payload
    },
    setSndList: (state, action) => {
      state.sndList = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setAutocompleteSelectedTask: (state, action) => {
      state.autocompleteSelectedTask = action.payload
    },
    setIsTaskThreadOpen: (state, action) => {
      state.isTaskThreadOpen = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setQueryCategory: (state, action) => {
      state.queryCategory = action.payload
    }
  }
})

export const { setIsTaskLoading, setTasks, updateTasks, setPushNotifications, updatePushNotifications, updatePushNotification, setThreadMessages, updateThreadMessages, setSelectedStatusType, setSelectedDate, setTicketTimeline, setSndList, setSearchQuery, setAutocompleteSelectedTask, setIsTaskThreadOpen, setError, setQueryCategory } = taskSlice.actions
export default taskSlice.reducer