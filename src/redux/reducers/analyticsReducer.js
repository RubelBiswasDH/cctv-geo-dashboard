import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAnalyticsLoading: false,
    analytics: {},
    errorAnalytics: null,
}

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setIsAnalyticsLoading: (state, action) => {
            state.isAnalyticsLoading = action.payload
        },
        setAnalytics: (state, action) => {
            state.analytics = action.payload
        },
        setErrorAnalytics: (state, action) => {
            state.errorAnalytics = action.payload
        }
    }
})

export const { setIsAnalyticsLoading, setAnalytics, setErrorAnalytics } = analyticsSlice.actions

export default analyticsSlice.reducer
