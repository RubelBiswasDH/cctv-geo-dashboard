
import { getAuthToken } from './authActions'
import { SOCKET,SOCKET_A } from '../../App.config'
import {  updateAnnouncements } from "../reducers/announcementReducer"
import { updateAttendance } from '../reducers/attendanceReducer'
import {transformAnnouncements, transformAttendance} from '../../utils/utils'

export function activateSocket_A() {
    return (dispatch ) => {
  
      // Get Auth Token
      const token = getAuthToken()
      const companyId = localStorage.getItem("companyId")

      window.Pusher.logToConsole = false;
  
      window.pusher = new window.Pusher(SOCKET_A.PUSHER_APP_KEY, {
          
        cluster: SOCKET_A.PUSHER_APP_CLUSTER,
        secret: SOCKET_A.PUSHER_APP_SECRET,
        appId:SOCKET_A.PUSHER_APP_ID,
        key:SOCKET_A.PUSHER_APP_KEY,
        wsHost: SOCKET_A.WS_HOST,
        wsPort: SOCKET_A.WS_PORT,
        forceTLS: false,
        authEndpoint: SOCKET_A.AUTH_ENDPOINT,
        auth: {
          headers: {
            Authorization: `Bearer ${ token }`
          }
        }
      }) 
      
    
      // Task Channel
      window.pusher.subscribe(SOCKET_A.CHANNEL+companyId)
        .bind(SOCKET_A.ANNOUNCEMENT_EVENT, data => {         
  
          const transformedAnnouncements = transformAnnouncements([ data ])

          // Add Socket Data To Redux State
          dispatch( updateAnnouncements(transformedAnnouncements))
  
        })
        .bind(SOCKET_A.ATTENDANCE_EVENT, data => {  
   
          const transformedAttendance = transformAttendance([ data ])

          // Add Socket Data To Redux State
          dispatch( updateAttendance(transformedAttendance))
          })
        .bind("pusher:subscription_error", (error) => {
          var { status } = error;
          console.log("error on pusher: ",status)
          if (status === 408 || status === 503) {
            // Retry?
          }
        });
  
    }
  }
  
  // Deactivate Socket
  export function deactivateSocket() {
    return () => {
      if(window.pusher) {
        window.pusher.unsubscribe(SOCKET.DMS_TASK_CHANNEL)
        delete window.pusher
      }
    }
  }
  