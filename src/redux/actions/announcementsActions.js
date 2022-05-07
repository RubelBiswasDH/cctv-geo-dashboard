import { getAuthToken } from './authActions'
import { updateTasks, updatePushNotifications } from '../reducers/taskReducer'
import { loadThreadMessage, transformTasks } from '../actions/taskActions'
import { SOCKET,SOCKET_A } from '../../App.config'
import { setAnnouncements, updateAnnouncements, setError } from "../reducers/announcementReducer"
import axios from 'axios'
import { AUTH,API } from '../../App.config'
import dayjs from 'dayjs'

import {transformAnnouncements} from '../../utils/utils';


//get all announcement 

export function getAnnouncements(params) {
  const token = getAuthToken();
  //console.log('token on get Attendance: ', token)
  //console.log({ token })
  return dispatch => {
      // Set `isValidating`
      // dispatch( setIsValidating(true) )

      axios.get(API.GET_ALL_ANNOUNCEMENT, { headers: { Authorization: `Bearer ${ token }` }, params } )
          .then(res => {
              //console.log("data , ",res.data )
              const announcementData = res.data
              if(announcementData) {
                const transformedAnnouncements = transformAnnouncements(announcementData.announcement)
                  //console.log(" attendance data : ",announcementData)     
                  //console.log(" attendance data : ",announcementData.announcement)          
                  dispatch(setAnnouncements(transformedAnnouncements))
                  //console.log('attendance setted')
                  // Dispatch authReducer Values to Redux State
               


              }

              // Set `isValidating`
  

          })
          .catch(err => {
              //console.log("error on attendance: ",err)
              //console.error(err)

              dispatch( setAnnouncements([]) )
              dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )

          })
  }
}


///////////////
// Utilities //
///////////////
// Get User Auth Token
// export function getAuthToken() {
//   const token = localStorage.getItem('token')
//   if(token) {
//       return token
//   }

//   return null
// }


// attendance channel

// Activate Socket
// export function activateSocket_A() {
//   return (dispatch, getState) => {
//     // Get Auth Token
//     const token = getAuthToken()

//     window.pusher = new window.Pusher(SOCKET_A.PUSHER_APP_KEY, {
        
//       cluster: SOCKET_A.PUSHER_APP_CLUSTER,
//       wsHost: SOCKET_A.WS_HOST,
//       wsPort: SOCKET_A.WS_PORT,
//       forceTLS: false,
//       authEndpoint: SOCKET_A.AUTH_ENDPOINT,
//       auth: {
//         headers: {
//           Authorization: `Bearer ${ token }`
//         }
//       }
//     })    
//     window.pusher.connection.bind("connected", function () {
//         // $("div#status").text("Realtime is go!");
//         console.log("Channel Connected")
//       });
//     // Task Channel
//     window.pusher.subscribe(SOCKET_A.CHANNEL)
//       .bind(SOCKET_A.ANNOUNCEMENT_EVENT, data => {         
//         //const prevAnnounceMent = getState().task.tasks
//         console.log("Socket data: ",data)
//         //const transformedTasks = transformTasks([ data ])

//         // Add Socket Data To Redux State
//         //dispatch( updateTasks(transformedTasks) )

//         // Load Push Notifications
//         // const pushNotifications = generatePushNotifications(transformedTasks, prevTasks)
//         // dispatch( updatePushNotifications(pushNotifications) )
        
//       })
//       .bind(SOCKET_A.ATTENDANCE_EVENT, data => {  
//             console.log("Attendence event data: ",data)      
//                 // const prevTasks = getState().task.tasks
        
//                 // const transformedTasks = transformTasks([ data ])
        
//                 // // Add Socket Data To Redux State
//                 // dispatch( updateTasks(transformedTasks) )
        
//                 // // Update Task Thread
//                 // dispatch( loadThreadMessage(data) )
                
//                 // Load Push Notifications
//                 // const pushNotifications = generatePushNotifications(transformedTasks, prevTasks)
//                 // dispatch( updatePushNotifications(pushNotifications) )
//               })
//               .bind("pusher:subscription_error", (error) => {
//                 var { status } = error;
//                 console.log("error on pusher: ",status)
//                 if (status == 408 || status == 503) {
//                   // Retry?
//                 }
//               });

//   }
// }

// // Deactivate Socket
// export function deactivateSocket() {
//   return () => {
//     if(window.pusher) {
//       window.pusher.unsubscribe(SOCKET.DMS_TASK_CHANNEL)
//       delete window.pusher
//     }
//   }
// }

//// attendence channel
///////////////
// Utilities //
///////////////
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