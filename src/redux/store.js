import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import taskReducer from './reducers/taskReducer'
import analyticsReducer from './reducers/analyticsReducer'
import attendanceReducer from './reducers/attendanceReducer'
const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    analytics: analyticsReducer,
    attendanceList: attendanceReducer,
  }
})

export default store