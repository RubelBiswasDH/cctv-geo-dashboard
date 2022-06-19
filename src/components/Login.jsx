import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Container, Hidden, Box, Paper, Typography, TextField, Button, Stack } from '@mui/material'

// Import Assets
import loginCover from '../assets/login-cover.jpg'
import bkoiLogo from '../assets/barikoi-logo.png'

// Import Actions & Methods
import { setEmployeeEmail, setPassword, setError } from '../redux/reducers/authReducer'
import { login } from '../redux/actions/authActions'

class Login extends React.PureComponent {
  state = {
    error: {
      employeeEmail: '',
      password: ''
    }
  }

  // On Change
  _onChange = e => {
    const { dispatch, authError } = this.props
    const { error } = this.state

    if(e.target.name === 'employeeEmail') {
      // If Employee Id
      dispatch( setEmployeeEmail(e.target.value?.trim() ?? '') )

    } else if(e.target.name === 'password') {
      // If Password
      dispatch( setPassword(e.target.value?.trim() ?? '') )

    } else {
      this.setState({ [ e.target.name ]: e.target.value })
    }

    // Clear Error
    if(error[ e.target.name ]) {
      this.setState({ error: { ...error, [ e.target.name ]: '' } })      
    }

    // Clear auth error from redux
    if(authError) {
      dispatch( setError('') )
    }
  }

  // On Submit
  _onSubmit = e => {
    e.preventDefault()
    const { dispatch, employeeEmail, password } = this.props

    // Validate Employee Id & Password
    const validateEmployeeEmail = this._validateEmployeeEmail(employeeEmail)
    const validatePassword = this._validatePassword(password)
    if(validateEmployeeEmail.success && validatePassword.success) {
      // Login
      dispatch( login({ email: employeeEmail, password, device:'web' }) )

    } else {
      this.setState({
        error: {
          employeeEmail: validateEmployeeEmail.message,
          password: validatePassword.message
        }
      })
    }
  }

  // Validate employeeEmail
  _validateEmployeeEmail = employeeEmail => {
    employeeEmail = employeeEmail.trim()
    const verdict = { success: false, message: '' }

    if(employeeEmail) {
      verdict.success = true
      verdict.message = ''

    } else {
      verdict.success = false
      verdict.message = 'Required field.'
    }

    return verdict
  }

  // Validate Password
  _validatePassword = password => {
    const verdict = { success: false, message: '' }

    if (password) {
      if (password.length < 6) {
        verdict.success = false
        verdict.message = 'Password must be atleast 6 digit!'

      } else {
        verdict.success = true
        verdict.message = ''
      }

    } else {
      verdict.success = false
      verdict.message = 'Required field.'
    }

    return verdict
  }

  render() {
    const { employeeEmail, password, authError } = this.props
    const { error } = this.state

    return (
      <Container sx={ containerStyles }>
        <Hidden mdDown={ true }>
          <Box
            sx={{
              height: 'auto',
              width: '550px',
              p: '32px',
              display:'flex',
              flexDirection:'column'
            }}
          >
            <Box sx={{display:'flex',gap:4}}>
                <Box>
                  <a href='/'>
                    <img
                      src={ bkoiLogo }
                      alt='Brand Logo'
                      height='32px'
                      style={ imgStyles }
                    />
                  </a>
                </Box>
                <Box>
                  <Typography
                    variant='h5'
                    color='text.secondary'
                    sx={{fontSize: { xs: '18px', sm: '20px', md: '24px'} }}
                  >
                    { 'HR Trace' }
                  </Typography>                
                </Box>
            </Box>
            <img
              src={ loginCover }
              alt='Login Cover'
              width='100%'
              height='100%'
              style={ imgStyles }
            />
          </Box>
        </Hidden>

        <Paper elevation={ 8 } sx={ paperStyles }>
          <Box sx={{ width: '100%' }}>
            <Typography
              component={ 'h2' }
              variant={ 'h5' }
              sx={{ fontSize: '28px' }}
            >
              { 'HR Trace Log In' }
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mt: '1rem' }}>
            <form onSubmit={ this._onSubmit }>
              <Stack spacing={ 2 }>
                <Box>
                  <Typography variant='h6'>{ 'Email' }</Typography>

                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='employeeEmail'
                    type='text'
                    value={ employeeEmail }
                    placeholder=''
                    onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeeEmail ? error.employeeEmail : null
                    }
                  />
                </Box>

                <Box>
                  <Typography variant='h6'>{ 'Password' }</Typography>
                  
                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='password'
                    type='password'
                    value={ password }
                    placeholder=''
                    onChange={ this._onChange }
                    error={
                      ( authError && authError.includes('password') ) || error.password ? true : false
                    }
                    helperText={
                      authError && authError.includes('password') ? authError : error.password ? error.password : null
                    }
                  />
                </Box>

                <Button
                  type='submit'
                  fullWidth={ true }
                  variant='contained'
                  sx={{mt:'2rem'}}
                >
                  { 'Log In' }
                </Button>
              </Stack>
            </form>
           {/*Register Button*/}
           <Button
                onClick={()=> {window.location.href = '/register'}}
                fullWidth={ true }
                variant='contained'
                sx={{mt:'1rem'}}
                color={'btnOrange'}
              >
                { 'Register' }
            </Button>  
             {/* Request Password Field */}
             <Box
              sx={{
                mt: '2rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
                <a href='/request-reset-password' style={{textDecoration: 'none'}}>
                    <span>Forget Password ! Reset Here...</span>
                  </a>            
            </Box>
            {/* Copyright Section */}
            <Box
              sx={{
                mt: '2rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
                <Typography
                  variant='body2'
                  display='block'
                  align='center'
                  sx={ attributionLinkStyles }
                >
                  { 'Copyright: Barikoi Technologies Limited' }
                </Typography>              
            </Box>
          </Box>
        </Paper>
      </Container>
    )
  }
}

// Styles
const containerStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '100vh',
  overflow: 'hidden'
}

const imgStyles = {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  maxHeight: '100%',
  objectFit: 'fill'
}

const paperStyles = {
  width: '320px',
  p: '32px',
  mx: {
    xs: '20px'
  }
}

const attributionLinkStyles = {
  marginLeft: '4px',
  fontSize: '11px'
}

// Prop Types
Login.propTypes = {
  employeeEmail: PropTypes.string,
  password: PropTypes.string,
  authError: PropTypes.string,
  dispatch: PropTypes.func
}

Login.defaultProps = {
  employeeEmail: '',
  password: '',
  authError: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  employeeEmail: state?.auth?.employeeEmail,
  password: state?.auth?.password,
  authError: state?.auth?.error
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Login)