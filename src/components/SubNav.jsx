import React from 'react'
import { connect } from 'react-redux'
import {Stack, Item, Button, Grid, Box} from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function CustomizedInputBase() {
    return (
      <Paper
        component="form"
        sx={{ p: '0px 0px', display: 'flex', alignItems: 'center',justifyContent:'center', width: '12vw', backgroundColor:'#5F5F5F',color:'white',borderRadius:'25px',px:'10px' }}
      >
        <InputBase
          sx={{ ml: 3,mt:.5, flex: 1,color:'white',opacity: 1}}
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


const StyledButton = (props) => {
        const btnStyle = {
            textTransform:'none',
            fontSize: '.8em',
            px:'10px',
            borderRadius: '25px',
            width: '12vw',
            minWidth: '12vw',
        }
        return (
            <Button onClick={props.onClick} sx={btnStyle} variant="contained" color="gray">{props.children}</Button>
        );
}

class SubNav extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        
        return (
        <Box sx={boxStyle}>
            <Stack direction="row" spacing={2}>
                <CustomizedInputBase/>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('attendance'))}>Admin</StyledButton>
            </Stack>
        </Box>
        );
    }
}

const mapStateToProps = state => ({
    employeeEmail: state.auth.employeeEmail,
    password: state.auth.password,
    authError: state.auth.error
  })

const boxStyle = {
    display:'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px',
    paddingBottom: '0px',
    mt:'20px',
    mb:'10px'
}

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SubNav)