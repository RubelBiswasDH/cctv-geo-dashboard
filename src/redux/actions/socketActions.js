// import { getAuthToken } from './authActions'
// import { updateTasks, updatePushNotifications } from '../reducers/taskReducer'
// import { loadThreadMessage, transformTasks } from '../actions/taskActions'
// import { SOCKET } from '../../App.config'

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