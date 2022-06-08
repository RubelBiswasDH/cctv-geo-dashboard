import { getAuthToken } from './authActions'
import { SOCKET,SOCKET_A } from '../../App.config'
import { setAnnouncements, updateAnnouncements, setCurrentAnnouncement, setCurrentAnnouncementId, setEditAnnouncementDialogIsOpen, setError } from "../reducers/announcementReducer"
import axios from 'axios'
import { AUTH,API } from '../../App.config'
import dayjs from 'dayjs'

import {transformAnnouncements} from '../../utils/utils';


//submit announcement edit

export function updateAnnouncement(id, data) {
  const token = getAuthToken();
  const date = new Date()   
  const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
  const end_date = dayjs(new Date()).format('YYYY-MM-DD')
  return dispatch => {
    axios.post(API.UPDATE_ANNOUNCEMENT + id, data, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const announcementData = res.data
        if (announcementData.status === 200) {
          dispatch( getAnnouncements({start_date: `${start_date}`, end_date: `${end_date}`}) )
          dispatch(setCurrentAnnouncement(''))
          dispatch(setEditAnnouncementDialogIsOpen(false))
          dispatch(setCurrentAnnouncementId(''))
        }
      })
      .catch(err => {
        console.log("error on announcement: ", err)

      })
  }
}

//get single announcement

export function getAnnouncement(id) {
  const token = getAuthToken();
  return dispatch => {

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
  const token = getAuthToken();
  return dispatch => {

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

// Generate Push Notification
function generatePushNotifications(tasks, prevTasks) {
  if(!tasks) {
    return []
  }

  // Filter Tasks In Contrast With Prev Tasks. Accept if newly opened, flagged emergency or resolved
  const pushNotifications = tasks.filter(t =>
    (t.status === 'OPEN' && prevTasks && !prevTasks.find(pt =>
      pt.id === t.id
    )) ||
    t.status === 'RESOLVED' ||
    (prevTasks && prevTasks.find(pt =>
      pt.id === t.id &&
      pt.is_emergency !== t.is_emergency &&
      t.is_emergency
    ))
  )
  .map((t, i) => ({
    id: `t${ t.id }-${ i }-${ t.updated_at }`,
    title: (prevTasks && prevTasks.find(pt =>
        pt.id === t.id &&
        pt.is_emergency !== t.is_emergency &&
        t.is_emergency
      )) ?
      `[${ t.ticket_number }] task flagged emergency!`
      :
      t.status === 'OPEN' ?
      `[${ t.ticket_number }] New task opened`
      :
      `[${ t.ticket_number }] task resolved`,
    time: t.updated_at ? t.updated_at : '',
    opened: false,
    task: t
  }))

  return pushNotifications
}