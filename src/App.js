import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import Components
import { Box, CircularProgress, Snackbar, Alert } from '@mui/material'
import HrTraceDashboard from './components/HrTraceDashboard'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/common/ProtectedRoute'

// Import Styles
import './App.css'

// Import Actions & Methods
import { validateUser } from './redux/actions/authActions'
import RequestResetPassword from './components/RequestResetPassword'
import ResetPassword from './components/ResetPassword'
import { setToastIsOpen } from '../src/redux/reducers/hrtReducer'

class App extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props

    // Validate User
    const token = localStorage.getItem('token')
    if(token){
      dispatch( validateUser(token) )
    }
   
  }
  _handleToastClose = () => {
    const { dispatch } = this.props
    dispatch( setToastIsOpen(false) )
  }
  render() {
    const { isAuthenticated, isValidating, toastIsOpen, toastMessage, toastSeverity } = this.props

    return (
      <Box sx={ containerStyles }>
        { isValidating ?
          <CircularProgress />
          :
          <BrowserRouter>
            <Routes>
              <Route
                exact={ true }
                path='/login'
                element={
                  isAuthenticated ?
                    <Navigate to='/' />
                    :
                    <Login />
                }
              />

            <Route
                exact={ true }
                path='/register'
                element={
                  isAuthenticated ?
                    <Navigate to='/' />
                    :
                    <Register />
                }
              />
            <Route
                exact={ true }
                path='/request-reset-password'
                element={
                  isAuthenticated ?
                    <Navigate to='/' />
                    :
                    <RequestResetPassword />
                }
              />
               <Route
                exact={ true }
                path='/reset-password/*'
                element={
                  isAuthenticated ?
                    <Navigate to='/' />
                    :
                    <ResetPassword />
                }
              />
              <Route
                exact={ true }
                path='/'
                element={
                  <ProtectedRoute
                    isAuthenticated={ isAuthenticated }
                    element={
                      <HrTraceDashboard />
                    }
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        }
          <Snackbar 
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            open={toastIsOpen} autoHideDuration={6000} onClose={this._handleToastClose}>
            <Alert onClose={this._handleToastClose} severity={ toastSeverity } sx={{ width: '100%' }}>
              {toastMessage}
            </Alert>
          </Snackbar>
      </Box>
    )
  }
}

// Styles
const containerStyles = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

// Prop Types
App.propTypes = {
  isAuthenticated: PropTypes.bool,
  isValidating: PropTypes.bool,
  dispatch: PropTypes.func
}

App.defaultProps = {
  isAuthenticated: false,
  isValidating: false,
  dispatch: () => null
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isValidating: state.auth.isValidating,
  toastIsOpen: state?.hrt?.toastIsOpen,
  toastSeverity: state?.hrt?.toastSeverity,
  toastMessage: state?.hrt?.toastMessage
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(App)