import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Container, Hidden, Box, Paper, Typography, TextField, Button, Stack,Autocomplete } from '@mui/material'

// Import Assets
import loginCover from '../../assets/login-cover.jpg'
import { setEmployeeName, setEmployeeEmail, setEmployeePhone, setCompanyName, setCompanyNameOptions, setPassword, setPassword_2, setError } from '../../redux/reducers/registerReducer'
import { register,getCompanyList } from '../../redux/actions/registerActions'

// Import Actions & Methods
//import { setEmployeeEmail, setPassword, setError } from '../redux/reducers/authReducer'

function CustomInput() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={['option 1','option 2']}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}

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


  // handleAutoCompInputChange
  handleAutoCompInputChange = e => {
    const { dispatch } = this.props
    dispatch(getCompanyList(e.target.value))
    console.log('onInputChange called, value :', e.target.value)

  }

// handleAutoCompChange
  handleAutoCompChange = (e,value) => {
    console.log('selected place: ', e.target, value)
    console.log('onChange Called')
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
        dispatch( setCompanyName(e.target.value ?? '') )
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
    const validateCompanyName = this._validateCompanyName(companyName)
    const validatePassword = this._validatePassword(password)
    const validatePassword_2 = this._validatePassword_2(password,password_2)
    if(validateEmployeeName.success && validateEmployeePhone.success &&  validateEmployeeEmail.success && validateCompanyName.success && validatePassword.success && validatePassword_2.success) {
      // Register
      const user = {
        name:employeeName,
        email: employeeEmail,
        phone: employeePhone,
        company_name: companyName,
        password: password
      }
      //console.log('submited register data: ',user)
      dispatch( register(user) )

    } else {
      this.setState({
        error: {
          employeeName: validateEmployeeName.message,
          employeeEmail: validateEmployeeEmail.message,
          employeePhone: validateEmployeePhone.message,
          companyName: validateCompanyName.message,
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
  _validatePassword_2 = (password,password_2) => {
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
    const {employeeName, employeeEmail, employeePhone, companyName, companyNameOptions, password, password_2, authError } = this.props
    const { error } = this.state
    const {handleAutoCompInputChange, handleAutoCompChange} = this
    console.log('ac :',companyNameOptions)
    const autoCompleteOptons = companyNameOptions.map(c => c.Address)

    console.log('autoComplate optons: ', autoCompleteOptons)

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

                {/*Company Name*/}
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
                  
                 
                {/*Autocomplete Company Name*/}
                {/* <Box sx={{boxStyle}}>
                  <Typography variant='h6'>{ 'Company Name ' }</Typography>
                  <Autocomplete
                  onChange={handleAutoCompChange}
                  onInputChange={handleAutoCompInputChange}

                  disablePortal
                  id="combo-box-demo"
                  options={autoCompleteOptons}
                  sx={{ width: '100%' }}
                  renderInput={(params) => 
                  <TextField
                  {...params}
                    variant='outlined'
                    margin='none'
                    size='small'
                    fullWidth={ true }
                    name='companyName'
                    type='text'
                    // value={ companyName }
                    placeholder='Enter Company Name...'
                    // onChange={ this._onChange }
                    error={
                      ( authError && !authError.includes('password') ) || error.employeeEmail ? true : false
                    }
                    helperText={
                      authError && !authError.includes('password') ? authError : error.employeePhone ? error.employeePhone : null
                    }
                  />
                }
                />
                </Box>  */}
                {/* Password */}
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
                      ( authError && authError.includes('password') ) || error.password_2 ? true : false
                    }
                    helperText={
                      authError && authError.includes('password') ? authError : error.password_2 ? error.password_2 : null
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
            {/* Login Button */} 
            <Button
                onClick={()=> {window.location.href = '/login'}}
                fullWidth={ true }
                variant='contained'
                color={'btnOrange'}
                sx={{mt:'1rem',pt:.5}}
              >
                { 'Login Instead' }
            </Button>  
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
  companyNameOptions: state.register.companyNameOptions,
  companyLongitude: state.register.companyNameLongitude,
  companyLatitude: state.register.companyNameLatiitude,
  password: state.register.password,
  password_2: state.register.password_2,
  authError: state.register.error
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Register)