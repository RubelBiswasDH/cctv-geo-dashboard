import axios from 'axios'

import { setAddressOptions } from '../reducers/cctvGeoReducer'
import { API } from '../../App.config'

// getAddressList
export function getAddressList(name) {
    return dispatch => {
        if(name && name?.length > 0){
        dispatch(setAddressOptions([]))
        // axios.get(`${API.AUTOCOMPLETE}?q=${name}&org=${API.ORG}`)
        axios.get(`${API.AUTOCOMPLETE}+${name}`)
            .then(res => {
                dispatch(setAddressOptions(res.data.places))
            })
            .catch(err => {
                console.error(err)
            })
        }
    }
}