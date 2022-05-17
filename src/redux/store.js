import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import registerReducer from './reducers/registerReducer'
import taskReducer from './reducers/taskReducer'
import analyticsReducer from './reducers/analyticsReducer'
import attendanceReducer from './reducers/attendanceReducer'
import announcementsReducer from "../redux/reducers/announcementReducer"
import dashboardReducer from "../redux/reducers/dashboardReducer"
import adminReducer from './reducers/adminReducer'
import employeeReducer from './reducers/employeeReducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    analytics: analyticsReducer,
    attendanceList: attendanceReducer,
    announcements: announcementsReducer,
    dashboard: dashboardReducer,
    register: registerReducer,
    admin:adminReducer,
    employeeList: employeeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})

export default store