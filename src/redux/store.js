import { configureStore } from '@reduxjs/toolkit'
import cctvGeoReducer from './reducers/cctvGeoReducer'

const store = configureStore({
  reducer: {
    cctvGeo: cctvGeoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})

export default store