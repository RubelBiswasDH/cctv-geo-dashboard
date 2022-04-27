import axios from 'axios'
import dayjs from 'dayjs'
import { getAuthToken } from './authActions'
import { setIsTaskLoading, setTasks, updateThreadMessages, setError, setQueryCategory } from '../reducers/taskReducer'
import { API } from '../../App.config'

// Load Tasks
export function loadTasks( params ) {
  return dispatch => {
    // Set Is Loading
    dispatch( setIsTaskLoading(true) )

    // Get All Tasks
    axios.get(API.GET_ALL_TASKS, { params })
      .then(res => {
        if(res.data && res.data.tasks) {
          const transformedTasks = transformTasks(res.data.tasks)

          // Dispatch `taskReducer` Values to Redux State
          dispatch( setTasks(transformedTasks) )
          dispatch( setError('') )
          dispatch( setIsTaskLoading(false) )

        } else {
          throw new Error('No data found')
        }
      })
      .catch(err => {
        //console.error(err)

        // Dispatch `taskReducer` Values to Redux State
        dispatch( setIsTaskLoading(false) )
        dispatch( setTasks([]) )
        dispatch( setError(err.message ? err.message : '') )
      })
  }
}

// Load Task Thread Message
export function loadThreadMessage(task) {
  return dispatch => {
    const message = {
      message: `Ticket ID ${ task.ticket_number } changed to ${ task.status }.`,
      time: dayjs(task.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      task
    }

    dispatch( updateThreadMessages([ message ]) )
  }
}

// Load Initial Thread Messages
export function loadInitialThreadMessages(start_date, end_date) {
  return dispatch => {
    getAllTaskUpdates(start_date, end_date)
      .then(taskUpdates => {
        const threadMessages = taskUpdates.map(tu => ({
          message: `Ticket ID ${ tu?.ticket_number ?? '' } changed to ${ tu?.task_status ?? '' }.`,
          time: dayjs(tu?.updated_at ?? '').format('YYYY-MM-DD HH:mm:ss'),
          task: {}
        }))

        dispatch( updateThreadMessages(threadMessages) )
        
      })
      .catch(err => {
        //console.error(err)
      })
  }
}

///////////////
// Utilities //
///////////////
// Transform Task Data
export function transformTasks(tasks) {
  if(!tasks) {
    return []
  }

  const transformedTasks = tasks.map(t => ({
    ...t,
    created_at: dayjs(t.created_at).format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs(t.updated_at).format('YYYY-MM-DD HH:mm:ss')
  }))

  const transformedTasksSortByDate = sortByDate(transformedTasks)  
  return transformedTasksSortByDate
}

// Sort by Date
export function sortByDate(tasks) {
  return tasks.sort((a, b) => {
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

// Load SND List
export function loadSndList() {
  // Get All Tasks
  return axios.get(API.GET_ALL_SND)
    .then(res => {
      if(res.data && res.data.data) {
        return res.data.data

      } else {
        throw new Error('No data found')
      }
    })
    .catch(err => {
      throw err
    })
}

// Get Task Timeline Data
export function getTimelineData(taskId, sndList) {
  // Get All Tasks
  return axios.get(API.GET_TASK_TIMELINE + taskId)
    .then(res => {
      if(res.data && res.data.task_updates) {
        if(!res.data.task_updates || res.data.task_updates.length === 0) {
          return []
        }

        const timelineData = []
        res.data.task_updates.forEach((u, i) => {
          if(!u.changes || !u?.changes?.length) {
            return timelineData.push({              
              message: `Task ${u?.task_status === 'DMS_OPEN' ? 'viewed' : 'opened'} by ${ u.user_name }` ,
              time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
            })
          }

          const changes = JSON.parse(u.changes)
          
          // If Address is updated
          const addressUpdated = changes.find(c => c.key === 'exact_address')
          if(addressUpdated) {
            return timelineData.push({
              message: `Address updated from "${ addressUpdated.previous }" to "${ addressUpdated.new }" ${ u?.user_name ? `by ${u.user_name}` : '.'}`,
              time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
            })
          }

          // If Status Changed
          const statusChange = changes.find(c => c.key === 'status') ?? {}
          if(statusChange) {
            // If Status Changed to DISPATCHED
            if(u.task_status === 'DISPATCHED') {
              const snd = sndList.find(s => s.snd.id === u.snd_id)?.snd?.snd_name ?? 'N/A'

              // If Reopened
              if(statusChange.previous === 'RESOLVED' && statusChange.new === 'DISPATCHED') {
                // With Remarks
                if(u.remarks) {
                  timelineData.push({
                    message: `Task re-opened by ${ u.user_name } with remarks "${ u.remarks }".`,
                    time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                  })

                } else {
                  // Without Remarks
                  timelineData.push({
                    message: `Task re-opened by ${ u?.user_name ?? '' }.`,
                    time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                  })
                }
              }

              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task dispatched to ${ snd ?? 'N/A' } by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task dispatched to ${ snd ?? 'N/A' } by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to ASSIGNED
            if(u.task_status === 'ASSIGNED') {
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task assigned to ${ u?.fieldforce_name ?? 'N/A' } by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task assigned to ${ u?.fieldforce_name ?? 'N/A' } by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to ONGOING
            if(u.task_status === 'ONGOING') {
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task started by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task started by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to PRECOMPLETION
            if(u.task_status === 'PRECOMPLETION') {
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task closed(Gang) by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task closed(Gang) by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to RESOLVED
            if(u.task_status === 'RESOLVED') {
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task resolved by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task resolved by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to CLOSED
            if(u.task_status === 'CLOSED') {
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task closed(DMS) by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task closed(DMS) by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            // If Status Changed to INCOMPLETE
            if(u.task_status === 'INCOMPLETE') {              
              // With Remarks
              if(u.remarks) {
                return timelineData.push({
                  message: `Task incompleted by ${ u.user_name } with remarks "${ u.remarks }".`,
                  time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
                })
              }

              // Without Remarks
              return timelineData.push({
                message: `Task incompleted by ${ u?.user_name ?? '' }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }
          }

          changes.forEach(c => {
            if(c.key === 'is_emergency') {
              return timelineData.push({
                message: `Task flagged "emergency" by ${ u.user_name }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            if(c.key === 'snd_id') {
              const snd = sndList.find(s => s.snd.id === u.snd_id)?.snd?.snd_name ?? 'N/A'
              const prevSnd = sndList.find(s => s.snd.id === c.previous)?.snd?.snd_name ?? 'N/A'

              return timelineData.push({
                message: `Task SnD changed to "${ snd }" from "${ prevSnd }" by ${ u.user_name }.`,
                time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
              })
            }

            return timelineData.push({
              message: `Task field "${ c.key }" updated to "${ c.new }" from "${ c.previous }" by ${ u.user_name } ${ u.remarks ? ` with remarks "${ u.remarks }"` : '' }.`,
              time: dayjs(new Date(u.created_at)).format('YYYY-MM-DD HH:mm:ss')
            })
          })
        })

        return timelineData

      } else {
        throw new Error('No data found')
      }
    })
    .catch(err => {
      throw err
    })
}

// Dispatch To SND
export function updateTask(taskId, data) {
  if(taskId === '' || taskId === null || taskId === undefined) {
    return
  }

  // Get All Tasks
  return axios.post(API.UPDATE_TASK + taskId, data)
    .then(res => {
      return res.data

    })
    .catch(err => {
      throw err
    })
}

// Get All Task Updates
export function getAllTaskUpdates(start_date, end_date) {  
  return axios.get(API.GET_ALL_TASK_UPDATES, { params: { start_date, end_date } })
    .then(res => {
      if(res.data && res.data.task_updates) {
        if(!res.data.task_updates || res.data.task_updates.length === 0) {
          return []
        }

        return res.data.task_updates

      } else {
        throw new Error('No data found')
      }
    })
    .catch(err => {
      throw err
    })
}

// Get Query Categories
export function getQueryCategories() {
  return dispatch => {
    return axios.get(API.GET_QUERY_CATEGORIES)
      .then(res => {      
        if(res.data) {
          if(!res.data || res.data.length === 0) {
            return []
          }

          // Transform Data
          const transformedData = _transformData(res.data)

          dispatch( setQueryCategory(transformedData) )

        } else {
          throw new Error('No data found')
        }
      })
      .catch(err => {
        throw err
      })
  }
}

// Transform quer
const _transformData = (data) => {
  // filter same category
  const categories = data.reduce((acc, curr) => {
      if (acc.includes(curr.query_category)) {
          return acc
      } else {
          return [...acc, curr.query_category]
      }
  }, [])

  const transformedData = categories.map(category => {
      return {
          category,
          subCategories: data.filter(data => data.query_category === category).map(data => data.query_sub_category)
      }
  })    
  return transformedData
}

// Send Task Click Count
export function sendTaskClickCount(taskId) {  
  // Get Auth Token
  const token = getAuthToken()

  // Send Click Count
  axios.get(API.SEND_TASK_CLICK_COUNT + taskId, { headers: { Authorization: 'Bearer ' + token } })
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