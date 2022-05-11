import axios from 'axios'
import { API } from '../../App.config'
import { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError  } from '../reducers/registerReducer'

// Login Action
export function createUser(user) {
    return dispatch => {
        // Set `isValidating`
       // dispatch( setIsValidating(true) )

        axios.post(API.CREATE_USER, user)
            .then(res => {
                //console.log({ register: res.data})
                //window.location.href = '/login';
                // if(res.data && res.data.token) {
                //     const token = res.data.token
                //     //console.log("token at login api ",token)
                //     // Validate User
                //     dispatch( validateUser(token) )
                    
                // } else {
                //     throw new Error('Token Not Found')
                // }
            })
            .catch(err => {
                console.error(err)

            })
    }
}


