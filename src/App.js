import CCTVGeoDashboard from './components/CCTVGeoDashboard'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import Components
import { Box, CircularProgress } from '@mui/material'
// Import Styles
import './App.css'


class App extends React.PureComponent {
  render() {
    const isValidating = false
    return (
      <Box sx={{ ...containerStyles }}>
        { isValidating ?
          <CircularProgress />
          :
          <BrowserRouter>
            <Routes>
              <Route
                exact={ true }
                path='/'
                element={
                  <CCTVGeoDashboard/>
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
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing:'border-box',
  p:0,m:0
}

// Prop Types
App.propTypes = {
  isAuthenticated: PropTypes.bool,
  dispatch: PropTypes.func
}

App.defaultProps = {
  isAuthenticated: false,
  dispatch: () => null
}

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(null,mapDispatchToProps)(App)