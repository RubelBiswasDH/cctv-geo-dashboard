import React from 'react'
import { connect } from 'react-redux'
import {Stack, Item, Button, Grid, Box} from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'

const StyledButton = (props) => {
        const btnStyle = {
            textTransform:'none',
            fontSize: '.8em',
            px:'10px',
            borderRadius: '10px',
            width: '12vw',
            minWidth: '12vw',
        }
        return (
            <Button onClick={props.onClick} sx={btnStyle} variant="contained" color="gray">{props.children}</Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        return (
        <Box sx={boxStyle}>
            <Stack direction="row" spacing={2}>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('in_service'))}>In service: 232</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('not_in_service'))}>Not in service: 43</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('males'))}>Total males: 234</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('females'))}>Total females 99</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('probational_period'))}>Probationary period: 12</StyledButton>
                <StyledButton onClick={() => this.props.dispatch(setCurrentView('attendance'))}>Attendance</StyledButton>
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
    justifyContent: 'center',
    padding: '10px',
    my:'20px'
}

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterEmpolyee)