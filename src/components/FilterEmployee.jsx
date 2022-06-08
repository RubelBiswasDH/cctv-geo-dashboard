import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Box, Typography } from '@mui/material'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setView } from '../utils/utils'

const CustomButton = (props) => {
        const {sx, name, currentView} = props
        const btnStyle = {
            textTransform:'none',
            borderRadius: '.8em',
            minWidth:'100%',
            background:'transparent',
            border: '1px solid black',
        }

        const activeBtn = (currentView === name)? {background:'#ADD8E6'}:{}

        const handleClick = () => {
            props.onClick()
        }

        return (
            <Button onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="gray"><Typography sx={{p:.5,pt:.75, fontSize:{xs:'.2em', sm:'.8em',md:'.8em',lg:'.8em',xl:'.8em'},fontWeight:400,color:'black', ...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
        this.countEmployee = this.countEmployee.bind(this)
        this.handleView = this.handleView.bind(this)
    }
    handleView = (view) => {
        this.props.dispatch(setCurrentView(view))
        setView(view)
    }
    countEmployee = (key,value) => {
        if(this.props.employeeList && this.props.employeeList?.length>0){
            
            if(key.length <= 0 || value.length <= 0){
                return this.props.employeeList.length
            }

            const empList = this.props.employeeList.map(emp => ({
                ...emp,
                profile:JSON.parse(emp.profile)
            }))
            let count=0
            empList.forEach(
                (emp) => {
                    if(emp.profile && emp?.profile[key]){
                        if(emp?.profile[key]?.toLowerCase() === value){
                            count+=1
                        }
                    }
                })
            return count
        }
        return 0
    }

    render(){
        const { currentView } = this.props
        const { countEmployee, handleView } = this
        return (
        <Box sx={theme => ({padding: {
            xs: `${ theme.spacing(0,2) }`,
            md: theme.spacing(0,4)
          },
         
          width: '100%'})} >
            <Grid container spacing={1} direction="row" sx={{p:0,m:0,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start'}}>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>               
                        <CustomButton sx={{}} onClick={() => handleView('attendance')} name={"attendance"} currentView ={currentView} >Attendance</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>               
                        <CustomButton sx={{}} onClick={() => handleView('announcements')} name={"announcements"} currentView ={currentView} >Announcements</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>
                        <CustomButton sx={{}} onClick={() => handleView('total_employees')} name={'total_employees'} currentView ={currentView} >Total employees: {countEmployee("","")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>
                        <CustomButton sx={{}} onClick={() => handleView('males')} name={'males'} currentView ={currentView} >Total males: {countEmployee("gender","male")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>
                        <CustomButton sx={{}} onClick={() => handleView('females')} name={'females'} currentView ={currentView} >Total females: {countEmployee("gender","female")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>
                        <CustomButton sx={{}} onClick={() => handleView('probational_period')} name={'probational_period'} currentView ={currentView} >Probation: {countEmployee("job_status","probation")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={1.7}>
                        <CustomButton sx={{}} onClick={() => handleView('intern')} name={'intern'} currentView ={currentView} >Intern: {countEmployee("job_status","intern")}</CustomButton>
                    </Grid>
                
 
            </Grid>
        </Box>
        );
    }
}

const mapStateToProps = state => ({
    employeeEmail: state?.auth?.employeeEmail,
    password: state?.auth?.password,
    authError: state?.auth?.error,
    currentView: state?.dashboard?.currentView,
    employeeList: state?.employeeList?.employeeList,
  })

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterEmpolyee)