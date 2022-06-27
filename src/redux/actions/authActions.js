import axios from 'axios'
import { AUTH } from '../../App.config'
import { setEmployeeEmail, setPassword, setError, setIsAuthenticated, setIsValidating, setToken, setUser } from '../reducers/authReducer'
import { setToastIsOpen, setToastMessage, setToastSeverity } from '../reducers/hrtReducer';
// Login Action
export function login(user) {
    return dispatch => {
        // Set `isValidating`
        dispatch( setIsValidating(true) )

        axios.post(AUTH.LOGIN_API, user)
            .then(res => {
                if(res.data && res.data.token) {
                    const token = res.data.token
                    // Validate User
                    localStorage.setItem('companyId', res.data.user.company.id)
                    dispatch( validateUser(token) )
                    
                } else {
                    throw new Error('Token Not Found')
                }
            })
            .catch(err => {
                console.error(err)
                // Dispatch `authReducer` Values to Redux State
                dispatch( setIsAuthenticated(false) )
                dispatch( setToken(null) )
                dispatch( setUser({}) )
                dispatch( setError("Wrong Email or Password"))

                // Set `isValidating`
                dispatch( setIsValidating(false) )
            })
    }
}

// Logout Action
export function logout() {
    return dispatch => {
        // Set `isValidating`
        dispatch( setIsValidating(true) )

        // Clear localStorage
        localStorage.clear()

        // Dispatch `authReducer` Values to Redux State
        dispatch( setIsAuthenticated(false) )
        dispatch( setToken(null) )
        dispatch( setUser({}) )
        dispatch( setError('') )

        // Set `isValidating`
        dispatch( setIsValidating(false) )
    }
}

// User Validation
export function validateUser(token) {

    return dispatch => {
        // Set `isValidating`
        dispatch( setIsValidating(true) )
        
        axios.get(AUTH.GET_USER_API, { headers: { Authorization: `Bearer ${ token }` } })
            .then(res => {
                const userData = res.data.data
                if(userData) {
                    const user = {
                        id:userData.id,
                        username:userData.name,
                        user_type: userData.user_level,
                        is_allowed: userData.is_allowed
                    }
                    // Authenticate only for user_type = DISPATCHER & SUPERVISOR
                    if( ! user.is_allowed) {
                        throw new Error("You don't have permission to access Dashboad")
                    }

                    // Save `token` & `user` to localStorage
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))

                    // Dispatch authReducer Values to Redux State
                    dispatch( setIsAuthenticated(true) )
                    dispatch( setToken(token) )
                    dispatch( setUser(user) )
                    dispatch( setError('') )
                    dispatch( setEmployeeEmail('') )
                    dispatch( setPassword('') )

                    // Set axios default token
                    axios.defaults.headers.common.Authorization = `Bearer ${ token }`

                    // Set `isValidating`
                    dispatch( setIsValidating(false) )

                }

                // Set `isValidating`
                dispatch( setIsValidating(false) )

            })
            .catch(err => {
                console.error(err)
                // Dispatch authReducer Values to Redux State
                dispatch( setIsAuthenticated(false) )
                dispatch( setToken(null) )
                dispatch( setUser({}) )
                dispatch( setError(err?.response?.data?.message ?? err?.message ?? '') )

                // Clear localStorage
                localStorage.clear()

                // Set `isValidating`
                dispatch( setIsValidating(false) )
            })
    }
}

// request reset password
export function requestResetPassword(email) {
    return dispatch => {
        axios.post(AUTH.REQUEST_RESET_PASSWORD, email)
            .then(res => {
                dispatch(setToastMessage(res.data.message))
                dispatch(setToastSeverity('success'))
                dispatch(setToastIsOpen(true))
            })
            .catch(err => {
                console.error(err)
                
            })
    }
}

// reset password
export function resetPassword(data) {
    return dispatch => {
        axios.post(AUTH.RESET_PASSWORD, data)
            .then(res => {
                dispatch(setToastMessage(res.data.message))
                dispatch(setToastSeverity('success'))
                dispatch(setToastIsOpen(true))
            })
            .catch(err => {
                console.error(err)
                
            })
    }
}
