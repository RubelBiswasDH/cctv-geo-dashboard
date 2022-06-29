import axios from 'axios'
import { AUTH, API } from '../../App.config'
import { setCompanyNameOptions } from '../reducers/registerReducer'
import {login} from '../actions/authActions'
import {setToastMessage, setToastSeverity, setToastIsOpen} from "../reducers/dashboardReducer"
import { setView } from '../../utils/utils'

// Login Action
export function register(user) {
    return dispatch => {
        axios.post(AUTH.REGISTER_API, user)
            .then(res => {
                setView('company_profile')
                dispatch( login({ email: user.email, password:user.password, device:'web' }) )
            })
            .catch(err => {
                console.error(err)
                if(err?.response?.data?.message?.email){
                    dispatch(setToastMessage(err?.response?.data?.message?.email[0]))
                }
                else if(err?.response?.data?.message?.phone){
                    dispatch(setToastMessage(err?.response?.data?.message?.phone[0]))
                }
                    
                dispatch(setToastSeverity('error'))
                dispatch(setToastIsOpen(true))
            })
    }
}

// getCompanyList
export function getCompanyList(name) {
    return dispatch => {
        if(name && name?.length > 0){
        axios.get(API.AUTOCOMPLETE+name)
            .then(res => {
                dispatch(setCompanyNameOptions(res.data.places))
            })
            .catch(err => {
                console.error(err)
            })
        }
    }
}
