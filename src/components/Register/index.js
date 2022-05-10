import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Container, Hidden, Box, Paper, Typography, TextField, Button, Stack } from '@mui/material'

// Import Assets
import loginCover from '../../assets/login-cover.jpg'
import { setEmployeeName, setEmployeeEmail, setEmployeePhone, setCompanayName, setPassword, setPassword_2, setError } from '../../redux/reducers/registerReducer'
import { register } from '../../redux/actions/registerActions'

// Import Actions & Methods
//import { setEmployeeEmail, setPassword, setError } from '../redux/reducers/authReducer'


class Register extends React.PureComponent {
  state = {
    error: {
      employeeName: '',
      employeePhone: '',
      employeeEmail: '',
      companyName:'',
      password: '',
      password_2: ''
    }
  }

  // On Change
  _onChange = e => {
    const { dispatch, authError } = this.props
    const { error } = this.state

//     if(e.target.name === 'employeeEmail') {
//       // If Employee Id
//       dispatch( setEmployeeEmail(e.target.value?.trim() ?? '') )

//     } else if(e.target.name === 'password') {
//       // If Password
//       dispatch( setPassword(e.target.value?.trim() ?? '') )

//     } else {
//       this.setState({ [ e.target.name ]: e.target.value })
//     }

switch (e.target.name) {
    case 'employeeName':
        dispatch( setEmployeeName(e.target.value ?? '') )
        break;
    case 'employeeEmail':
        dispatch( setEmployeeEmail(e.target.value?.trim() ?? '') )
        break;
    case 'employeePhone':
        dispatch( setEmployeePhone(e.target.value?.trim() ?? '') )
        break;
    case 'companyName':
        dispatch( setCompanayName(e.target.value ?? '') )
        break;
    case 'password':
        dispatch( setPassword(e.target.value?.trim() ?? '') )
        break;
    case 'password_2':
        dispatch( setPassword_2(e.target.value?.trim() ?? '') )
        break;
    // default:
    //   data = empData;
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
    const { dispatch,employeeName, employeeEmail, employeePhone, companyName, password, password_2 } = this.props

    // Validate Employee Id & Password
    const validateEmployeeName = this._validateEmployeeName(employeeName)
    const validateEmployeePhone = this._validateEmployeePhone(employeePhone)
    const validateEmployeeEmail = this._validateEmployeeEmail(employeeEmail)
    const validateCompanayName = this._validateCompanyName(companyName)
    const validatePassword = this._validatePassword(password)
    const validatePassword_2 = this._validatePassword(password_2)
    if(validateEmployeeEmail.success && validatePassword.success) {
      // Register
      console.log('submited register data')
      //dispatch( register({ email: employeeEmail, password }) )

    } else {
      this.setState({
        error: {
          employeeName: validateEmployeeName.message,
          employeeEmail: validateEmployeeEmail.message,
          employeePhone: validateEmployeePhone.message,
          companyName: validateCompanayName.message,
          password: validatePassword.message,
          password_2: validatePassword_2.message
        }
      })
    }
  }

   // Validate employeeName
   _validateEmployeeName = employeeName => {
    employeeName = employeeName.trim()
    const verdict = { success: false, message: '' }

    if(employeeName) {
      verdict.success = true
      verdict.message = ''

    } else {
      verdict.success = false
      verdict.message = 'Required field.'
    }

    return verdict
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
    // Validate employeePhone
       _validateEmployeePhone = employeePhone => {
        employeePhone = employeePhone.trim()
        const verdict = { success: false, message: '' }
    
        if(employeePhone) {
          verdict.success = true
          verdict.message = ''
    
        } else {
          verdict.success = false
          verdict.message = 'Required field.'
        }
    
        return verdict
      }

      // Validate companyName
      _validateCompanyName = companyName => {
        companyName = companyName.trim()
        const verdict = { success: false, message: '' }
    
        if(companyName) {
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

  // Validate Password2
  _validatePassword_2 = password => {
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
    const {employeeName, employeeEmail, employeePhone, companyName, password, password_2, authError } = this.props
    const { error } = this.state

    return (
      <Container sx={ containerStyles }>
        <Hidden mdDown={ true }>
          <Box
            sx={{
              height: '70vh'
            }}
          >
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
              { 'Hr Trace Register' }
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mt: '1rem' }}>
            <form onSubmit={ this._onSubmit }>
              <Stack spacing={ 2 }>
              <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Employee Name' }</Typography>

                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='employeeName'
                    type='text'
                    value={ employeeName }
                    placeholder='Enter Employee Name...'
                    onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeePhone ? error.employeePhone : null
                    }
                  />
                </Box>

                {/* 'Employee Email' */}
                <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Employee Email' }</Typography>

                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='employeeEmail'
                    type='text'
                    value={ employeeEmail }
                    placeholder='Enter Employee Email...'
                    onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeeEmail ? error.employeeEmail : null
                    }
                  />
                </Box>
                {/*phone*/}
                <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Employee Phone' }</Typography>

                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='employeePhone'
                    type='text'
                    value={ employeePhone }
                    placeholder='Enter Employee Phone...'
                    onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeePhone ? error.employeePhone : null
                    }
                  />
                </Box>

                {/*email*/}
                <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Company Name' }</Typography>

                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='companyName'
                    type='text'
                    value={ companyName }
                    placeholder='Enter Company Name...'
                    onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeePhone ? error.employeePhone : null
                    }
                  />
                </Box>
                <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Password' }</Typography>
                  
                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='password'
                    type='password'
                    value={ password }
                    placeholder='Enter Password...'
                    onChange={ this._onChange }
                    error={
                      ( authError && authError.includes('password') ) || error.password ? true : false
                    }
                    helperText={
                      authError && authError.includes('password') ? authError : error.password ? error.password : null
                    }
                  />
                </Box>

                <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Retype Password' }</Typography>
                  
                  <TextField
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='password_2'
                    type='password'
                    value={ password_2 }
                    placeholder='Retype Password...'
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
                >
                  { 'Register' }
                </Button>
              </Stack>
            </form>

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
  },
}

const attributionLinkStyles = {
  marginLeft: '4px',
  fontSize: '11px'
}
const boxStyle = {
    display:'flex',
    flexDirection: 'row'
}
// Prop Types
Register.propTypes = {
  employeeEmail: PropTypes.string,
  password: PropTypes.string,
  authError: PropTypes.string,
  dispatch: PropTypes.func
}

Register.defaultProps = {
  employeeEmail: '',
  password: '',
  authError: '',
  dispatch: () => null
}

const mapStateToProps = state => ({
  employeeName: state.register.employeeName, 
  employeeEmail: state.register.employeeEmail,
  employeePhone: state.register.employeePhone,
  companyName: state.register.companyName,
  password: state.register.password,
  password_2: state.register.password_2,
  authError: state.register.error
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Register)