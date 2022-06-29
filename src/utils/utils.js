import dayjs from 'dayjs'
import axios from 'axios'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { useSearchParams } from 'react-router-dom'
import { API } from '../App.config'

// Union Array Of Objects By Key
export function unionArrayOfObjects(array1, array2, key) {

  if( array1 && array2 && key && key.length){
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


export function sortByDate(data) {
  return data.sort((a, b) => {
    const timeA = new Date(a.created_at) // ignore upper and lowercase
    const timeB = new Date(b.created_at) // ignore upper and lowercase

    if (timeA > timeB) {
      return -1;
    }
    if (timeA < timeB) {
      return 1;
    }
    return 0;
  })
}

export function sortDates(array) {
  return array.sort((a,b) => Date.parse(b) - Date.parse(a))
}

export function transformAnnouncements(announcements) {
  if(!announcements) {
    return []
  }

  const transformedAnnouncements = announcements.map(t => ({
    ...t,
    created_at: dayjs(t?.created_at).format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs(t?.updated_at).format('YYYY-MM-DD HH:mm:ss')
  }))
  const transformedAnnouncementsSortByDate = sortByDate(transformedAnnouncements)  
  return transformedAnnouncementsSortByDate
}

export function transformAttendance(attendance) {
  if(!attendance){
    return []
  }

  const transformedAttendance = attendance.map(t => ({
    ...t,
    enter_time: dayjs(t?.enter_time).format('YYYY-MM-DD HH:mm:ss'),
    exit_time: (t?.exit_time)?dayjs(t.exit_time).format('YYYY-MM-DD HH:mm:ss'):'-',
    created_at: dayjs(t?.created_at).format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs(t?.updated_at).format('YYYY-MM-DD HH:mm:ss')
  }))
  const transformedAttendanceSortByDate = sortByDate(transformedAttendance)  
  return transformedAttendanceSortByDate
}

export function getCurrentView() {
  const currentView = localStorage.getItem('currentView')
  if(currentView) {
      return currentView
  }
  return 'attendance'
}

export function setView(currentView) {
  localStorage.setItem('currentView', currentView)
  setCurrentView(currentView)
}


export const getReverseGeoAddress = (params) => {  
  // Get Auth Token
  const token = getAuthToken()

  return axios.get(API.REVERSEGEO, { headers: { Authorization: `Bearer ${token}` }, params })      
      .then(res => {
          return res.data
      })
      .catch(err => {
          throw err
      })
}

// Get User Auth Token
export function getAuthToken() {
  const token = localStorage.getItem('token')
  if(token) {
      return token
  }
  return null
}

export const withRouter = props => WrappedComponent => moreProps => {
  const searchParams = useSearchParams()
  return (
    <WrappedComponent { ...props } { ...searchParams } {...moreProps } />
  )
 }

 const getTokenFromUrl = (url) => {
      const  token = url.substring(url.lastIndexOf('=') + 1);
      return token
 }

 const removeByKey = (myObj, deleteKey) => {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current];
      return result;
  }, {});
}
const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

 export { getTokenFromUrl, removeByKey, renameKeys }