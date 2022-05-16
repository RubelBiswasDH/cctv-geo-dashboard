import React from 'react'
import { connect } from 'react-redux'
import { Stack, Item, Button, Grid, Box, Typography } from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'

const StyledButton = (props) => {
        const {sx} = props
        const btnStyle = {
            textTransform:'none',
            fontSize: '.8em',
            borderRadius: '.3em',
            minWidth:'100%',
            background:'transparent',
            border: '2px solid black',


        }
        return (
            <Button onClick={props.onClick} sx={{...btnStyle}} variant="contained" color="gray"><Typography sx={{p:.5,pt:.75, fontSize: '1em',color:'black', ...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        return (
        <Box sx={theme => ({padding: {
            xs: `${ theme.spacing(0,2) }`,
            md: theme.spacing(0,4)
          },
         
          width: '100%'})} >
            <Grid container xs={12} spacing={1} direction="row" sx={{p:0,m:0,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start'}}>
                {/* <Grid item sx={4} lg={1.7}>
                    <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</StyledButton>
                </Grid> */}
                
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('in_service'))}>In service: 232</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('not_in_service'))}>Not in service: 43</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('males'))}>Total males: 234</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('females'))}>Total females 99</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('probational_period'))}>Probationary period: 12</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>               
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('attendance'))}>Attendance</StyledButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>               
                        <StyledButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('profile'))}>Profile</StyledButton>
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