import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { DatePicker, DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// Import Components
import { Grid, Paper, InputBase, Box, Stack, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Divider } from '@mui/material'
import { Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'

// Import Actions & Methods
import { stopNotificationSound, sortByDate } from '../utils/utils'
import { attendanceWithAbsenceInfo } from '../utils/attendanceUtils'
import { setFilterOptions, updateFilterOptions, setUniqueDates, setCurrentAttendanceTab } from '../redux/reducers/attendanceReducer'
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'
import { updateNewUser, updateNewUserProfile } from '../redux/reducers/adminReducer'

import dayjs from 'dayjs'

class AddUser extends React.PureComponent {
 
  state = {

  }

  componentDidMount() {
    const { dispatch } = this.props

  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
      if (this.props.attendanceList !== prevProps.attendanceList) {
        this._getUniqueDates()
      }
    }
  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
  }

  
  render() {
    const { dispatch, newUser } = this.props

    return (
      <Box width='100%' height='54vh'>
        <Box sx={{py:2,pb:5}}>
            <Typography
                variant='h4'
            >
                Add New User
            </Typography>
        </Box>
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'flex-start', alignItems:'center',width:'100%', pl:5,gap:3}}>
            <UserField  dispatch={dispatch} field={'name'}  title={"Name : "} value={newUser?.name} fieldStyle={{ width:'50%' }}/>
            <UserField  dispatch={dispatch} field={'email'}  title={"E: Mail : "} value={newUser?.email} fieldStyle={{ width:'40%' }}/>
            <UserField  dispatch={dispatch} field={'phone'}  title={"Phone : "} value={newUser?.phone} fieldStyle={{ width:'40%' }}/>
            <FilterField 
                filterOptions={[
                    'Frontend Engineer',
                    'Backend Engineer',
                    'Sr. Frontend Engineer'
                ]}  
                dispatch={dispatch} 
                field={'profile'} 
                subField={'position'}  
                title={"Position : "} 
                value={newUser?.profile?.position} 
                fieldStyle={{ width:'25%' }}
            />
             <FilterField 
                filterOptions={[
                    'Management',
                    'Admin',
                    'Product Team',
                    'Business Team',
                    'Tech Team',
                    'Operations Team',
                    
                ]}  
                dispatch={dispatch} 
                field={'profile'} 
                subField={'department'}  
                title={"Department : "} 
                value={newUser?.profile?.position} 
                fieldStyle={{ width:'25%' }}
            />
        </Box>
      </Box>
    )
  }
}

// field to add user information

const UserField = (props) => {
    const { title, value, field, subField, dispatch, style, fieldStyle, titleStyle } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontSize: '18px',
    }
    const handleChange = e => {
        e.preventDefault()
        if (field === 'profile') {
            dispatch(updateNewUserProfile({
                [subField]: e.target.value
            }))
        }
        else {
            dispatch(updateNewUser({ [field]: e.target.value }))
        }

    }
    return (
        <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
            <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
                <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
            </Box>
            <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'50%', ...fieldStyle }}>
                <Paper
                    xs={12}
                    sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000',width:'100%', border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px', ...style }}
                >   
                    
                    <InputBase
                        sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1 }}
                        inputProps={{ 'aria-label': { title }, color: '#000000' }}
                        value={value || ''}
                        onChange={handleChange}
                    />
                </Paper>
            </Box>
        </Grid>
    )
}


const FilterField = (props) => {
  const { dispatch, action, value, field, subField, filterOptions, title, fieldStyle, fullWidth, sx } = props
  const handleChange = e => {
    e.preventDefault()
    if (field === 'profile') {
        dispatch(updateNewUserProfile({
            [subField]: e.target.value
        }))
    }
    else {
        dispatch(updateNewUser({ [field]: e.target.value }))
    }

}
const textStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
}
  return (
    <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
            <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
        </Box>
        <FormControl fullWidth={false} sx={{p:0,m:0,width:'30%', ...fieldStyle}} size="small">
                {/* <InputLabel id="demo-simple-select-label">''</InputLabel> */}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value= { filterOptions?filterOptions[0]:'None'}
                    label=""
                    onChange={handleChange}
                    sx = {{fontSize: '.75em'}}
                >    
                    {filterOptions.map(d => (<MenuItem value={d}>{d}</MenuItem>))}            
                </Select>
            </FormControl>
    </Grid>
  )
}

const TabSwitchButton = (props) => {
    const { value, dispatch, action, isActive } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
        /* identical to box height, or 171% */
        textAlign: 'center',
        letterSpacing:' 0.4px',
        textTransform: 'uppercase',
        /* Light/Primary/Main */
        color:'rgba(0, 0, 0, 0.38)',
        px:2,
        borderBottom: '2px solid transparent'
    }
    const activeBtnStyle = isActive?{
        color: '#007AFF',
        borderBottom: '2px solid #007AFF'
    }:
    {}
    const handleClick = () => {
        dispatch(action(value))
    }
    return (
        <Button onClick={handleClick} variant="text"><Typography sx={{ ...textStyle, ...activeBtnStyle }}>{value}</Typography></Button>
    )
}
// Prop Types
AddUser.propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,

}

AddUser.defaultProps = {
  dispatch: () => null,
  user: {},
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  newUser: state?.admin?.newUser,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)