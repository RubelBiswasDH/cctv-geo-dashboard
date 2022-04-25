import axios from 'axios'
import { setIsAnalyticsLoading, setAnalytics, setErrorAnalytics } from '../reducers/analyticsReducer'
import { API } from '../../App.config'

// Get Analytics
function getAnalytics(params) {
    return dispatch => {        
        // Set loading
        dispatch( setIsAnalyticsLoading(true) )
        return axios.get(API.GET_ANALYTICS, { params })
            .then(res => {
                // Set loading
                dispatch( setIsAnalyticsLoading(false) )
                if(res.data) {

                    // Set analytics
                    dispatch( setAnalytics(res.data) )
                } else {

                    // Set error
                    dispatch( setErrorAnalytics(res) )
                    throw new Error('No data found')
                }
            })
            .catch(err => {
                // Set loading
                dispatch( setIsAnalyticsLoading(false) )

                // Set error
                dispatch( setErrorAnalytics(err) )
                throw err
            })
    }
}

export { getAnalytics }