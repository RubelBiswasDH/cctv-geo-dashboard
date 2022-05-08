import regularNotificationAudioClip from '../assets/notification_tone.mp3'
import emergencyNotificationAudioClip from '../assets/emergency_alarm.mp3'

import dayjs from 'dayjs'



// Union Array Of Objects By Key
export function unionArrayOfObjects(array1, array2, key) {
  const array = [ ...array1 ]
  array2.forEach(o => {
    const index = array.findIndex(a => a[ key ] === o[ key ])
    if(index >= 0) {
      array[ index ] = o

    } else {
      array.push(o)
    }
  })
  
  return array
}

const audio = new Audio(regularNotificationAudioClip)
const audioEmergency = new Audio(emergencyNotificationAudioClip)


// Play general notification sound
export function playNotificationSound(key) {
  audio.muted = false
  audioEmergency.muted = false

  if(key === 'emergency') {
    audioEmergency.play()
  } else {
    audio.play()
  }
}

// Stop general notification sound
export function stopNotificationSound() {
  audio.pause()
  audioEmergency.pause()
}

// Convert Seconds to Years, Months, Days, Hours, Minutes, Seconds
export function convertSecondsToTime(seconds) {
  const years = Math.floor(seconds / 31536000)
  const months = Math.floor((seconds % 31536000) / 2592000)
  const days = Math.floor(((seconds % 31536000) % 2592000) / 86400)
  const hours = Math.floor((((seconds % 31536000) % 2592000) % 86400) / 3600)
  const minutes = Math.floor(((((seconds % 31536000) % 2592000) % 86400) % 3600) / 60)
  const sec = Math.floor(((((seconds % 31536000) % 2592000) % 86400) % 3600) % 60)

  return `
    ${years ? years + 'Y' : ''} 
    ${months ? months + 'mo' : ''} 
    ${days ? days + 'D' : ''} 
    ${hours ? hours + 'H' : ''} 
    ${minutes ? minutes + 'min' : ''}
    ${sec ? sec + 'sec' : ''}`
}

// // //

export function sortByDate(data) {
  return data.sort((a, b) => {
    var timeA = new Date(a.created_at) // ignore upper and lowercase
    var timeB = new Date(b.created_at) // ignore upper and lowercase

    if (timeA > timeB) {
      return -1;
    }
    if (timeA < timeB) {
      return 1;
    }
    return 0;
  })
}

export function transformAnnouncements(announcements) {
  if(!announcements) {
    return []
  }

  const transformedAnnouncements = announcements.map(t => ({
    ...t,
    created_at: dayjs(t.created_at).format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs(t.updated_at).format('YYYY-MM-DD HH:mm:ss')
  }))
  //console.log('tranformAnnouncement : ',transformedAnnouncements)
  const transformedAnnouncementsSortByDate = sortByDate(transformedAnnouncements)  
  return transformedAnnouncementsSortByDate
}

export function transformAttendance(attendance) {
  if(!attendance){
    return []
  }

  const transformedAttendance = attendance.map(t => ({
    ...t,
    enter_time: dayjs(t.enter_time).format('YYYY-MM-DD HH:mm:ss'),
    exit_time: dayjs(t.exit_time).format('YYYY-MM-DD HH:mm:ss'),
    created_at: dayjs(t.created_at).format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs(t.updated_at).format('YYYY-MM-DD HH:mm:ss')
  }))
  //console.log('tranformAnnouncement : ',transformedAttendance)
  const transformedAttendanceSortByDate = sortByDate(transformedAttendance)  
  return transformedAttendanceSortByDate
}