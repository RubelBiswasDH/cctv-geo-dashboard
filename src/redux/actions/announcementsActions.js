import { getAuthToken } from '../../utils/utils'
import { setAnnouncements, setCurrentAnnouncement, setCurrentAnnouncementId, setEditAnnouncementDialogIsOpen, setError } from "../reducers/announcementReducer"
import axios from 'axios'
import { API } from '../../App.config'
import dayjs from 'dayjs'

import { transformAnnouncements } from '../../utils/utils';
import { setToastMessage, setToastIsOpen, setToastSeverity } from "../reducers/dashboardReducer"

//submit announcement edit

export function updateAnnouncement(id, data) {
  return dispatch => {
    const token = getAuthToken();
    const date = new Date()   
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    axios.post(API.UPDATE_ANNOUNCEMENT + id, data, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const announcementData = res.data
        if (announcementData.status === 200) {
          dispatch( getAnnouncements({start_date: `${start_date}`, end_date: `${end_date}`}) )
          dispatch(setCurrentAnnouncement(''))
          dispatch(setEditAnnouncementDialogIsOpen(false))
          dispatch(setCurrentAnnouncementId(''))
          dispatch(setToastMessage("Announcements updated successfully !"))
          dispatch(setToastIsOpen(true))
          dispatch(setToastSeverity('success'))
        }
      })
      .catch(err => {
        console.log("error on announcement: ", err)
        dispatch(setToastMessage("You are authorized to edit your own announcements only !"))
        dispatch(setToastIsOpen(true))
        dispatch(setToastSeverity('warning'))
      })
  }
}

//get single announcement

export function getAnnouncement(id) {
  return dispatch => {
    const token = getAuthToken();
    axios.get(API.GET_ANNOUNCEMENT + id, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const announcementData = res.data
        const msg = announcementData.announcement
        if (announcementData) {
          dispatch(setCurrentAnnouncementId(msg.id))
          dispatch(setCurrentAnnouncement(msg.description))
          dispatch(setEditAnnouncementDialogIsOpen(true))
        }
      })
      .catch(err => {
        console.log("error on announcement: ", err)

      })
  }
}


//get all announcement 

export function getAnnouncements(params) {
  return dispatch => {
      const token = getAuthToken();
      axios.get(API.GET_ALL_ANNOUNCEMENT, { headers: { Authorization: `Bearer ${ token }` }, params } )
          .then(res => {
              const announcementData = res.data
              if(announcementData) {
                const transformedAnnouncements = transformAnnouncements(announcementData.announcement)        
                  dispatch(setAnnouncements(transformedAnnouncements))
              }
  

          })
          .catch(err => {
              dispatch( setAnnouncements([]) )
              dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )
          })
  }
}
