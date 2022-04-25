import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import Components
import { Box, CircularProgress } from '@mui/material'
import DmsDashboard from './components/DmsDashboard'
import Login from './components/Login'
import ProtectedRoute from './components/common/ProtectedRoute'

// Import Styles
import './App.css'

// Import Actions & Methods
import { validateUser } from './redux/actions/authActions'

class App extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props

    // Validate User
    const token = localStorage.getItem('token')
    dispatch( validateUser(token) )
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
                path='/'
                element={
                  <ProtectedRoute
                    isAuthenticated={ isAuthenticated }
                    element={
                      <DmsDashboard />
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