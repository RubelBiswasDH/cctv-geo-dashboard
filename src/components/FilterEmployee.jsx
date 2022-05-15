import React from 'react'
import { connect } from 'react-redux'
import {Stack, Item, Button, Grid, Box, Typography} from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'

const StyledButton = (props) => {
        const {sx} = props
        const btnStyle = {
            textTransform:'none',
            fontSize: '1em',
            borderRadius: '.3em',
            minWidth:'100%'
        }
        return (
            <Button onClick={props.onClick} sx={{...btnStyle}} variant="contained" color="gray"><Typography sx={{...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        return (
        <Box sx={{ ...boxStyle}}>
            <Grid container spacing={1} xs={12} direction="row" sx={{pl:'2em',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start', backgroundColor:''}}>
                {/* <Grid item sx={4} lg={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</StyledButton>
                </Grid> */}
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('in_service'))}>In service: 232</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('not_in_service'))}>Not in service: 43</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('males'))}>Total males: 234</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('females'))}>Total females 99</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('probational_period'))}>Probationary period: 12</StyledButton>
                </Grid>
                <Grid item xs={3} xl={1.7}>               
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('attendance'))}>Attendance</StyledButton>
                </Grid>
            </Grid>
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
    justifyContent: 'space-around',
    padding: '10px',
    pb:0,
    mt:'10px',
    mb:'0px',
    gap:'4vw'
}

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterEmpolyee)