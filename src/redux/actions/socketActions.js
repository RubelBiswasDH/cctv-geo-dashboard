// import { getAuthToken } from './authActions'
// import { updateTasks, updatePushNotifications } from '../reducers/taskReducer'
// import { loadThreadMessage, transformTasks } from '../actions/taskActions'
// import { SOCKET } from '../../App.config'

//new imports

import { getAuthToken } from './authActions'
import { updateTasks, updatePushNotifications } from '../reducers/taskReducer'
import { loadThreadMessage, transformTasks } from '../actions/taskActions'
import { SOCKET,SOCKET_A } from '../../App.config'
import { setAnnouncements, updateAnnouncements, setError } from "../reducers/announcementReducer"
import { updateAttendance } from '../reducers/attendanceReducer'
import axios from 'axios'
import { AUTH,API } from '../../App.config'
import dayjs from 'dayjs'

import {transformAnnouncements, transformAttendance} from '../../utils/utils'
// // //

export function activateSocket_A() {
    return (dispatch, getState) => {
  
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
      
      // window.pusher.connection.bind("connecting", function () {
      //   // $("div#status").text("Realtime is go!");
      //   //console.log("Channel Connecting")
      // });
      // var state = window.pusher.connection.state;
      // //console.log("pusher state  before subscribe: ",state)
      // window.pusher.connection.bind("connected", function () {
      //     // $("div#status").text("Realtime is go!");
      //     //console.log("Channel Connected")
      //   });
  
      //   window.pusher.connection.bind("error", function (err) {
      //     //console.log('error on pusher channel not connected')
      //     if (err.error.data.code === 4004) {
      //       //console.log(">>> detected limit error");
      //     }
      //   });
  
      //   var state = window.pusher.connection.state;
      //   //console.log("pusher state  before subscribe: ",state)
      // Task Channel
      window.pusher.subscribe(SOCKET_A.CHANNEL+companyId)
        .bind(SOCKET_A.ANNOUNCEMENT_EVENT, data => {         
          // console.log("Socket data: ",data)
  
          //dispatch( updateAnnouncements(data) )
          const transformedAnnouncements = transformAnnouncements([ data ])
          // console.log('test transformedAnnouncements ', transformedAnnouncements)
          // Add Socket Data To Redux State
          dispatch( updateAnnouncements(transformedAnnouncements))
  
        })
        .bind(SOCKET_A.ATTENDANCE_EVENT, data => {  
          console.log("Attendance event data: ",data)      
          const transformedAttendance = transformAttendance([ data ])
          console.log('test transformedAttendance ', transformedAttendance)
          // Add Socket Data To Redux State
          dispatch( updateAttendance(transformedAttendance))
          })
        .bind("pusher:subscription_error", (error) => {
          var { status } = error;
          console.log("error on pusher: ",status)
          if (status == 408 || status == 503) {
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
  






// // //

// // Activate Socket
// export function activateSocket() {
//   return (dispatch, getState) => {
//     // Get Auth Token
//     const token = getAuthToken()

//     window.pusher = new window.Pusher(SOCKET.API_KEY, {
//       cluster: SOCKET.CLUSTER,
//       wsHost: SOCKET.WS_HOST,
//       wsPort: SOCKET.WS_PORT,
//       forceTLS: false,
//       authEndpoint: SOCKET.AUTH_ENDPOINT,
//       auth: {
//         headers: {
//           Authorization: `Bearer ${ token }`
//         }
//       }
//     })    
    
//     // Task Channel
//     window.pusher.subscribe(SOCKET.DMS_TASK_CHANNEL)
//       .bind(SOCKET.DMS_TASK_CREATE_EVENT, data => {         
//         const prevTasks = getState().task.tasks

//         const transformedTasks = transformTasks([ data ])

//         // Add Socket Data To Redux State
//         dispatch( updateTasks(transformedTasks) )

//         // Load Push Notifications
//         const pushNotifications = generatePushNotifications(transformedTasks, prevTasks)
//         dispatch( updatePushNotifications(pushNotifications) )
        
//       })
//       .bind(SOCKET.DMS_TASK_UPDATE_EVENT, data => {        
//         const prevTasks = getState().task.tasks

//         const transformedTasks = transformTasks([ data ])

//         // Add Socket Data To Redux State
//         dispatch( updateTasks(transformedTasks) )

//         // Update Task Thread
//         dispatch( loadThreadMessage(data) )
        
//         // Load Push Notifications
//         const pushNotifications = generatePushNotifications(transformedTasks, prevTasks)
//         dispatch( updatePushNotifications(pushNotifications) )
//       })
//       .bind(SOCKET.DMS_TASK_ASSIGN_EVENT, data => {        

//         const transformedTasks = transformTasks([ data ])

//         // Add Socket Data To Redux State
//         dispatch( updateTasks(transformedTasks) )
        
//       })
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

// ///////////////
// // Utilities //
// ///////////////
// // Generate Push Notification
// function generatePushNotifications(tasks, prevTasks) {
//   if(!tasks) {
//     return []
//   }

//   // Filter Tasks In Contrast With Prev Tasks. Accept if newly opened, flagged emergency or resolved
//   const pushNotifications = tasks.filter(t =>
//     (t.status === 'OPEN' && prevTasks && !prevTasks.find(pt =>
//       pt.id === t.id
//     )) ||
//     t.status === 'RESOLVED' ||
//     (prevTasks && prevTasks.find(pt =>
//       pt.id === t.id &&
//       pt.is_emergency !== t.is_emergency &&
//       t.is_emergency
//     ))
//   )
//   .map((t, i) => ({
//     id: `t${ t.id }-${ i }-${ t.updated_at }`,
//     title: (prevTasks && prevTasks.find(pt =>
//         pt.id === t.id &&
//         pt.is_emergency !== t.is_emergency &&
//         t.is_emergency
//       )) ?
//       `[${ t.ticket_number }] task flagged emergency!`
//       :
//       t.status === 'OPEN' ?
//       `[${ t.ticket_number }] New task opened`
//       :
//       `[${ t.ticket_number }] task resolved`,
//     time: t.updated_at ? t.updated_at : '',
//     opened: false,
//     task: t
//   }))

//   return pushNotifications
// }