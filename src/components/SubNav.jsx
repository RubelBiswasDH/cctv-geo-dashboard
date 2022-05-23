import React from 'react'
import { connect } from 'react-redux'
import {Stack, Item, Button, Grid, Box} from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setView } from '../utils/utils'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {Typography} from '@mui/material'

function CustomizedInputBase() {
    return (
      <Paper
        component="form"
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
        {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
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
        this.handleView = this.handleView.bind(this)
    }
    handleView = (view) => {
      this.props.dispatch(setCurrentView(view))
      setView(view)
    }
    render(){
        const {handleView} = this
        const {currentView} = this.props
        return (
        <Box sx={(theme) => ({...boxStyle,  padding: {
          xs: `${ theme.spacing(0,2) }`,
          md: theme.spacing(0,4)
        },
      
        width: '100%'})}>
            <Stack direction="row" spacing={2}>
                <CustomizedInputBase/>
                <CustomButton onClick={() => handleView('admin')} name={'admin'} currentView ={currentView}>Admin</CustomButton>
            </Stack>
        </Box>
        );
    }
}

const mapStateToProps = state => ({
    employeeEmail: state?.auth?.employeeEmail,
    password: state?.auth?.password,
    authError: state?.auth?.error,
    currentView: state?.dashboard?.currentView,
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