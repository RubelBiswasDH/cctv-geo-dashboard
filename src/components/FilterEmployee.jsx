import React from 'react'
import { connect } from 'react-redux'
import { Stack, Item, Button, Grid, Box, Typography } from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'

const CustomButton = (props) => {
        const {sx, name, currentView} = props
        const [btnStyle,setBtnStyle] = React.useState({
            textTransform:'none',
            fontSize: '.8em',
            borderRadius: '.3em',
            minWidth:'100%',
            background:'transparent',
            border: '2px solid black',
        })

        const activeBtn = (currentView === name)? {background:'#ADD8E6'}:{}

        const handleClick = () => {
            props.onClick()
            // setBtnStyle(pre => ({...pre, background:'green'}))
        }

        return (
            <Button onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="gray"><Typography sx={{p:.5,pt:.75, fontSize: '1em',color:'black', ...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        const {currentView} = this.props
        return (
        <Box sx={theme => ({padding: {
            xs: `${ theme.spacing(0,2) }`,
            md: theme.spacing(0,4)
          },
         
          width: '100%'})} >
            <Grid container xs={12} spacing={1} direction="row" sx={{p:0,m:0,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start'}}>
                {/* <Grid item sx={4} lg={1.7}>
                    <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))}>Total employees: 346</CustomButton>
                </Grid> */}
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>               
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('attendance'))} name={"attendance"} currentView ={currentView} >Attendance</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>               
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('announcements'))} name={"announcements"} currentView ={currentView} >Announcements</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('total_employees'))} name={'total_employees'} currentView ={currentView} >Total employees: 346</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('in_service'))} name={'in_service'} currentView ={currentView} >In service: 232</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('not_in_service'))} name={'not_in_service'} currentView ={currentView} >Not in service: 43</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('males'))} name={'males'} currentView ={currentView} >Total males: 234</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('females'))} name={'females'} currentView ={currentView} >Total females 99</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('probational_period'))} name={'probational_period'} currentView ={currentView} >Probationary period: 12</CustomButton>
                    </Grid>
                  
                    {/* <Grid sx={{m:0,p:0}} item xs={6} sm={4} md={3} xl={1.7}>               
                        <CustomButton sx={{}} onClick={() => this.props.dispatch(setCurrentView('profile'))}>Profile</CustomButton>
                    </Grid> */}
 
            </Grid>
        </Box>
        );
    }
}

const mapStateToProps = state => ({
    employeeEmail: state.auth.employeeEmail,
    password: state.auth.password,
    authError: state.auth.error,
    currentView: state.dashboard.currentView
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