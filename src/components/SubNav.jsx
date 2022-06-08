import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Stack, Item, Button, Grid, Box} from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setView } from '../utils/utils'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {Typography, Autocomplete, TextField} from '@mui/material'
import {getUserProfile} from '../redux/actions/adminActions'
import {setUserProfile} from "../redux/reducers/adminReducer"

function CustomizedInputBase(props) {
    return (
      <Paper
        sx={{boxSizing:'border-box', display: 'flex', alignItems: 'center',justifyContent:'center', width: '15vw', backgroundColor:'white',color:'white',borderRadius:'25px',px:'10px',pl:3.5, border:'1px solid black' }}
      >
        <InputBase
          sx={{ mt:.5, flex: 1,color:'white',opacity: 1}}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search',color:'white'  }}
        />
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon sx={{color:'white'}}/>
        </IconButton>
      </Paper>
    );
  }


const CustomButton = (props) => {
        const {currentView, name} = props
        const activeBtn = (currentView === name)? {background:'#ADD8E6'}:{}
        const btnStyle = {
            textTransform:'none',
            fontSize: '.8em',
            px:'0',
            borderRadius: '25px',
            width: '15vw',
            minWidth: '15vw',
            background:'transparent',
            border:'1px solid black'
        }
        return (
            <Button onClick={props.onClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="gray"><Typography sx={{fontSize:'1em',color:'black',width:'100%',borderRadius: '25px'}}>{props.children}</Typography></Button>
        );
}

class SubNav extends React.PureComponent{
    constructor(props){
        super(props)
        this.state = {
          employeeList:[]
        }
        this.handleView = this.handleView.bind(this)
    }
    componentDidMount(){
      if(this.props.employeeList.length>0){
        this.setState({employeeList:this.props.employeeList})
      }
    }

    handleView = (view) => {
      this.props.dispatch(setCurrentView(view))
      setView(view)
    }
      // handleAutoCompInputChange
    handleAutoCompInputChange = e => {
      const name = e.target.value
      if (name && name?.length > 0) {
        const empList = this.props.employeeList.filter(emp => emp?.name?.toLowerCase().startsWith(name?.toLowerCase()))
        this.setState({ employeeList: empList })
      }
    }

  // handleAutoCompChange
    handleAutoCompChange = (e,value) => {
      if(value && value?.id){
        this.props.dispatch(setUserProfile({}))
        this.props.dispatch(getUserProfile(value?.id))
        this.props.dispatch(setCurrentView('profile'))
      }
    }

    render(){
        const {handleView, handleAutoCompInputChange, handleAutoCompChange} = this
        const {currentView} = this.props
        const {employeeList} = this.state
        return (
        <Box sx={(theme) => ({...boxStyle,  padding: {
          xs: `${ theme.spacing(0,2) }`,
          md: theme.spacing(0,4)
        },
      
        width: '100%'})}>
            <Stack direction="row" spacing={2}>
            <Paper
              sx={{
                boxSizing:'border-box', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent:'center', 
                width: '15vw', 
                backgroundColor:'white',
                color:'white',
                borderRadius:'25px',
                px:'0',
                pl:2,
                border:'1px solid black' 
              }}
            >
            <Autocomplete
                  onChange={handleAutoCompChange}
                  onInputChange={handleAutoCompInputChange}

                  disablePortal
                  id="employeeSearch"
                  options={(employeeList?.length > 0)?employeeList:[]}
                  getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option
                    }
                    if (option.inputValue) {
                      return option.inputValue
                    }
                    return option.name
                  }}
                  renderOption={(props, option) => (
                    <Grid container {...props} key={option.id} >
                        <Grid item xs={12}><Typography sx={{fontSize:'1em'}}>{option?.name}</Typography></Grid>
                        <Grid item xs={12}><Typography>{option.email}</Typography></Grid>
                    </Grid>)}
                  sx={{ width: '100%' }}
                  renderInput={(params) => 
                    <TextField
                    {...params}
                     sx={{ mt:.5, flex: 1,color:'white',opacity: 1}}
                     placeholder="Search"
                     variant='standard'
                      margin='none'
                      size='small'
                      fullWidth={ true }
                      name='employeeName'
                      type='text'
                    InputProps={{ ...params.InputProps, disableUnderline: true }}
                   />
                }
                />
                 <IconButton sx={{ p:0,pr:2 }} aria-label="search">
                  <SearchIcon sx={{color:'white'}}/>
                </IconButton>
              </Paper>
                <CustomButton onClick={() => handleView('admin')} name={'admin'} currentView ={currentView}>Admin</CustomButton>
            </Stack>
        </Box>
        );
    }
}

SubNav.propTypes = {
  dispatch: PropTypes.func,
  employeeEmail : PropTypes.string,
  password : PropTypes.string,
  authError : PropTypes.string,
  currentView : PropTypes.string,
  employeeList : PropTypes.array,
}

SubNav.defaultProps = {
  dispatch: () => null,
  employeeEmail: '',
  password: '',
  authError: '',
  currentView: '',
  employeeList: []
}
const mapStateToProps = state => ({
    employeeEmail: state?.auth?.employeeEmail,
    password: state?.auth?.password,
    authError: state?.auth?.error,
    currentView: state?.dashboard?.currentView,
    employeeList:state?.employeeList?.employeeList
  })

const boxStyle = {
    display:'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px',
    paddingBottom: '0px',
    mt:'20px',
    mb:'10px',
    pl: '0px'
}

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SubNav)