import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Box, Typography } from '@mui/material'
import { setCurrentEmployeeType } from '../redux/reducers/employeeReducer'

const CustomButton = (props) => {
        const {sx, name, currentEmployeeType} = props
        const btnStyle = {
            textTransform:'none',
            // borderRadius: '.8em',
            minWidth:'100%',
            background:'iris',
            // border: '1px solid black',
        }

        const activeBtn = (currentEmployeeType === name)? {background:'#ADD8E6'}:{}

        const handleClick = () => {
            props.onClick()
        }

        return (
            <Button onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="iris"><Typography sx={{p:.5,pt:.75, fontSize:{xs:'.2em', sm:'.8em',md:'.8em',lg:'.8em',xl:'.8em'},fontWeight:400,color:'#FFFFFF', ...sx}}>{props.children}</Typography></Button>
            // <Button onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="gray"><Typography sx={{p:.5,pt:.75, fontSize:{xs:'.2em', sm:'.8em',md:'.8em',lg:'.8em',xl:'.8em'},fontWeight:400,color:'black', ...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
        this.countEmployee = this.countEmployee.bind(this)
        this.handleEmployeeTypeChange = this.handleEmployeeTypeChange.bind(this)
    }
    handleEmployeeTypeChange = (value) => {
        this.props.dispatch( setCurrentEmployeeType(value))
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
        const { currentView, currentEmployeeType } = this.props
        const { countEmployee, handleEmployeeTypeChange } = this
        return (
        <Box sx={theme => ({
          display:'flex',
          justifyContent:'center',
          width: '100%',
         
         })} >
            <Grid 
                container 
                spacing={0} 
                direction="row" 
                sx={{p:0,m:0,mb:1,gap:2,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start'}}>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton sx={{}} onClick={() => handleEmployeeTypeChange('total_employees')} name={'total_employees'} currentEmployeeType ={currentEmployeeType} >Total employees: {countEmployee("","")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton sx={{}} onClick={() => handleEmployeeTypeChange('males')} name={'males'} currentEmployeeType ={currentEmployeeType} >Total males: {countEmployee("gender","male")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton sx={{}} onClick={() => handleEmployeeTypeChange('females')} name={'females'} currentEmployeeType ={currentEmployeeType} >Total females: {countEmployee("gender","female")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton sx={{}} onClick={() => handleEmployeeTypeChange('probational_period')} name={'probational_period'} currentEmployeeType ={currentEmployeeType} >Probation: {countEmployee("job_status","probation")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton sx={{}} onClick={() => handleEmployeeTypeChange('intern')} name={'intern'} currentEmployeeType ={currentEmployeeType} >Intern: {countEmployee("job_status","intern")}</CustomButton>
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
    currentEmployeeType: state?.employeeList?.currentEmployeeType,
  })

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterEmpolyee)