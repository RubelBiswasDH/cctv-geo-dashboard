import axios from 'axios'
import { API } from '../../App.config'
import { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError  } from '../reducers/registerReducer'

// Login Action
export function createUser(user) {
    //console.log('user: ',user)
    return dispatch => {
        const token = getAuthToken()
        // Set `isValidating`
       // dispatch( setIsValidating(true) )
        console.log('user in actions ',user)
        //console.log('token: ',token)
        axios.post(API.CREATE_USER, user, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                console.log({ create_user_response: res.data})
                if(res.status===200){

                    alert("User Successfully Created")
                }
                //console.log('res :', res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export function getAuthToken() {
    const token = localStorage.getItem('token')
    if(token) {
        return token
    }

    return null
}