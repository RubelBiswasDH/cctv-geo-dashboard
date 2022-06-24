import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// Import Components
import { Container, Hidden, Box, Paper, Typography, TextField, Button, Stack } from '@mui/material'

// Import Assets
import loginCover from '../assets/login-cover.jpg'
import bkoiLogo from '../assets/barikoi-logo.png'

// Import Actions & Methods
import { setError, setNewPassword, setNewPassword_2 } from '../redux/reducers/authReducer'
import { resetPassword } from '../redux/actions/authActions'
import { getTokenFromUrl } from '../utils/utils'
import { setPasswordResetToken } from '../redux/reducers/authReducer'

class ResetPassword extends React.PureComponent {
   state = {
      error: {
          newPassword: '',
          newPassword_2: ''
      }
    }
  
  componentDidMount(){
    const { dispatch } = this.props
    const baseUrl = (window.location).href; // You can also use document.URL
    const token = getTokenFromUrl(baseUrl) 
    dispatch(setPasswordResetToken(token))

  }
  // On Change
  _onChange = e => {
    const { dispatch, authError } = this.props
    const { error } = this.state

    if(e.target.name === 'password') {
           // If Password
      dispatch( setNewPassword(e.target.value?.trim() ?? '') )
              // If Password 2
    } else if(e.target.name === 'password_2') {

      dispatch( setNewPassword_2(e.target.value?.trim() ?? '') )

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
    const { dispatch, newPassword, newPassword_2, passwordResetToken } = this.props

    // Validate Employee Id & Password
    const validatePassword = this._validateNewPassword(newPassword)    
    const validatePassword_2 = this._validateNewPassword_2(newPassword, newPassword_2)
    if( validatePassword.success && validatePassword_2.success) {
      dispatch( resetPassword({ password:newPassword, token:passwordResetToken }) )
    } else {
      this.setState({
        error: {
          newPassword: validatePassword.message,
          newPassword_2: validatePassword_2.message
        }
      })
    }
  }


  // Validate Password
  _validateNewPassword = password => {
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

 // Validate Password2
 _validateNewPassword_2 = (password,password_2) => {
    const verdict = { success: false, message: '' }

    if (password_2) {
      if (password_2.length < 6) {
        verdict.success = false
        verdict.message = 'Password must be atleast 6 digit!'

      }
      else if(password_2 !== password){
        verdict.success = false
        verdict.message = 'Password did not match!'
      }
       else {
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
    const { newPassword, newPassword_2, authError } = this.props
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
              { 'Reset Password' }
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mt: '1rem' }}>
            <form onSubmit={ this._onSubmit }>
              <Stack spacing={ 2 }>

                <Box>
                  <Typography variant='h6'>{ 'Password' }</Typography>
                  
                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='password'
                    type='password'
                    value={ newPassword }
                    placeholder=''
                    onChange={ this._onChange }
                    error={
                        ( authError && !authError.includes('password') ) || error.newPassword ? true : false
                      }
                      helperText={
                        authError && !authError.includes('password') ? authError : error.newPassword ? error.newPassword : null
                      }
                  />
                </Box>
                <Box >
                  <Typography variant='h6'>{ 'Retype Password' }</Typography>
                  
                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='password_2'
                    type='password'
                    value={ newPassword_2 }
                    placeholder=''
                    onChange={ this._onChange }
                    error={
                        ( authError && !authError.includes('password') ) || error.newPassword_2 ? true : false
                      }
                      helperText={
                        authError && !authError.includes('password') ? authError : error.newPassword_2 ? error.newPassword_2 : null
                      }
                  />
                </Box>

                <Button
                  type='submit'
                  fullWidth={ true }
                  variant='contained'
                  sx={{mt:'2rem'}}
                >
                  { 'Submit' }
                </Button>
              </Stack>
            </form>
           {/*Register Button*/}
           <Button
                onClick={()=> {window.location.href = '/login'}}
                fullWidth={ true }
                variant='contained'
                sx={{mt:'1rem'}}
                color={'btnOrange'}
              >
                { 'Login' }
            </Button>  
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
ResetPassword.propTypes = {
  employeeEmail: PropTypes.string,
  newPassword: PropTypes.string,
  newPassword_2: PropTypes.string,
  authError: PropTypes.string,
  passwordResetToken: PropTypes.string,
  dispatch: PropTypes.func
}

ResetPassword.defaultProps = {
  employeeEmail: '',
  newPassword: '',
  newPassword_2: '',
  passwordResetToken: null,
  authError: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  employeeEmail: state?.auth?.employeeEmail,
  newPassword: state?.auth?.newPassword,
  newPassword_2: state?.auth?.newPassword_2,
  passwordResetToken: state?.auth?.passwordResetToken,
  authError: state?.auth?.error
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
