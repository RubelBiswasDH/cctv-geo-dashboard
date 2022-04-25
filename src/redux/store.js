import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import taskReducer from './reducers/taskReducer'
import analyticsReducer from './reducers/analyticsReducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    analytics: analyticsReducer
  }
})

export default store