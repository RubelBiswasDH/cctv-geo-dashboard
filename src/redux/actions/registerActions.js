import axios from 'axios'
import { AUTH } from '../../App.config'
import { setIsValidating, setEmployeeName, setEmployeeEmail,setEmployeePhone, setCompanayName, setPassword, setError  } from '../reducers/registerReducer'

// Login Action
export function register(user) {
    return dispatch => {
        // Set `isValidating`
       // dispatch( setIsValidating(true) )

        axios.post(AUTH.REGISTER_API, user)
            .then(res => {
                console.log({ register: res.data})
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

                // Dispatch `authReducer` Values to Redux State
                // dispatch( setIsAuthenticated(false) )
                // dispatch( setToken(null) )
                // dispatch( setUser({}) )
                // dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )

                // Set `isValidating`
                // dispatch( setIsValidating(false) )
            })
    }
}



// // User Validation
// export function validateUser(token) {
//     //console.log('validate user..')
//     //console.log({ token })
//     return dispatch => {
//         // Set `isValidating`
//         dispatch( setIsValidating(true) )
        
//         axios.get(AUTH.GET_USER_API, { headers: { Authorization: `Bearer ${ token }` } })
//             .then(res => {
//                 //console.log("data , ",res.data )
//                 const userData = res.data.data
//                 if(userData) {
//                     // console.log("user Data: ",userData)
//                     // console.log("user type: ", userData)
//                     const user = {
//                         username:userData.name,
//                         user_type: userData.user_level,
//                     }
//                     //console.log(user)
//                     // Authenticate only for user_type = DISPATCHER & SUPERVISOR
//                     if(user.user_type !== 'HR' && user.user_type !== 'ADMIN') {
//                         throw new Error('User not authorized')
//                     }

//                     // Save `token` & `user` to localStorage
//                     localStorage.setItem('token', token)
//                     localStorage.setItem('user', JSON.stringify(user))

//                     // Dispatch authReducer Values to Redux State
//                     dispatch( setIsAuthenticated(true) )
//                     dispatch( setToken(token) )
//                     dispatch( setUser(user) )
//                     dispatch( setError('') )
//                     dispatch( setEmployeeEmail('') )
//                     dispatch( setPassword('') )

//                     // Set axios default token
//                     axios.defaults.headers.common.Authorization = `Bearer ${ token }`

//                     // Set `isValidating`
//                     dispatch( setIsValidating(false) )

//                 }

//                 // Set `isValidating`
//                 dispatch( setIsValidating(false) )

//             })
//             .catch(err => {
//                 //console.error(err)

//                 // Dispatch authReducer Values to Redux State
//                 dispatch( setIsAuthenticated(false) )
//                 dispatch( setToken(null) )
//                 dispatch( setUser({}) )
//                 dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )

//                 // Clear localStorage
//                 localStorage.clear()

//                 // Set `isValidating`
//                 dispatch( setIsValidating(false) )
//             })
//     }
// }

