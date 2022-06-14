import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import registerReducer from './reducers/registerReducer'
import attendanceReducer from './reducers/attendanceReducer'
import announcementsReducer from "../redux/reducers/announcementReducer"
import dashboardReducer from "../redux/reducers/dashboardReducer"
import adminReducer from './reducers/adminReducer'
import employeeReducer from './reducers/employeeReducer'
import hrtReducer from './reducers/hrtReducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendanceList: attendanceReducer,
    announcements: announcementsReducer,
    dashboard: dashboardReducer,
    register: registerReducer,
    admin:adminReducer,
    employeeList: employeeReducer,
    hrt: hrtReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})

export default store