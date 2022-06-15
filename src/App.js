import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import Components
import { Box, CircularProgress } from '@mui/material'
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

class App extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props

    // Validate User
    const token = localStorage.getItem('token')
    if(token){
      dispatch( validateUser(token) )
    }
   
  }

  render() {
    const { isAuthenticated, isValidating } = this.props

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
                path='/reset-password'
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
  isValidating: state.auth.isValidating
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(App)