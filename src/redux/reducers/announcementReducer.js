import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { unionArrayOfObjects } from '../../utils/utils'
import { sortByDate } from '../../utils/utils'

const initialState = {
  isAnnouncementLoading: false,
  announcements: [],
  pushNotifications: [],
  isAnnouncementThreadOpen: true,
  error: '',
  currentAnnouncement: '',
  currentAnnouncementId:'',
  editAnnouncementDialogIsOpen: false,
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
    setCurrentAnnouncementId: (state, action) => {
      state.currentAnnouncementId = action.payload
    },
    setEditAnnouncementDialogIsOpen: (state, action) => {
      state.editAnnouncementDialogIsOpen = action.payload
    },
    updateAnnouncements: (state, action) => {
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

export const { setAnnouncementLoading, setAnnouncements,updateAnnouncements, updateTasks, setPushNotifications, updatePushNotifications, updatePushNotification, setThreadMessages, updateThreadMessages, setSelectedStatusType, setSelectedDate, setTicketTimeline, setSndList, setSearchQuery, setAutocompleteSelectedTask, setIsTaskThreadOpen, setError, setQueryCategory, setCurrentAnnouncement, setEditAnnouncementDialogIsOpen, setCurrentAnnouncementId } = announcementsSlice.actions
export default announcementsSlice.reducer