import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../actions/taskActions'

const initialState = {
  isAnnouncementLoading: false,
  announcements: [],
  pushNotifications: [],
  isAnnouncementThreadOpen: true,
  error: '',
  currentAnnouncement: ' Its time for the offcial inspection. The pitch has been uncovered and a few areas around the square',
  editAnnouncementDialogIsOpen: true,
}

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncementLoading: (state, action) => {
      state.isTaskLoading = action.payload
    },
    setAnnouncements: (state, action) => {
      state.announcements = action.payload
    },
    setCurrentAnnouncement: (state, action) => {
      state.currentAnnouncement = action.payload
    },
    setEditAnnouncementDialogIsOpen: (state, action) => {
      state.editAnnouncementDialogIsOpen = action.payload
    },
    updateAnnouncements: (state, action) => {
      //console.log("state in store ", action.payload)
      state.announcements = sortByDate(unionArrayOfObjects(state.announcements, action.payload, 'id'))
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

    setIsAnnouncementThread: (state, action) => {
      state.isTaskThreadOpen = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },

  }
})

export const { setAnnouncementLoading, setAnnouncements,updateAnnouncements, updateTasks, setPushNotifications, updatePushNotifications, updatePushNotification, setThreadMessages, updateThreadMessages, setSelectedStatusType, setSelectedDate, setTicketTimeline, setSndList, setSearchQuery, setAutocompleteSelectedTask, setIsTaskThreadOpen, setError, setQueryCategory, setCurrentAnnouncement, setEditAnnouncementDialogIsOpen } = announcementsSlice.actions
export default announcementsSlice.reducer