import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Box, Typography } from '@mui/material'
import { setCurrentEmployeeType } from '../redux/reducers/employeeReducer'

const CustomButton = (props) => {
        const {sx, name, currentEmployeeType, disabled} = props
        const btnStyle = {
            textTransform:'none',
            minWidth:'100%',
            background:'#A5A6F6',
            "&:disabled": {
                backgroundColor: '#7879F1'
              },
            boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
            "&:disabled": {
                backgroundColor: '#7879F1'
              }
        }

        const activeBtn = (currentEmployeeType === name )? {background:'#7879F1'}:{}

        const handleClick = () => {
            props.onClick()
        }

        return (
            <Button disabled={disabled} onClick={handleClick} sx={{...btnStyle, ...activeBtn}} variant="contained" color="iris"><Typography sx={{p:.5,pt:.75, fontSize:{xs:'.2em', sm:'.8em',md:'.8em',lg:'.8em',xl:'.8em'},fontWeight:400,color:'#FFFFFF', ...sx}}>{props.children}</Typography></Button>
        );
}

class FilterEmpolyee extends React.PureComponent{
    constructor(props){
        super(props)
        this.handleCountEmployee = this.handleCountEmployee.bind(this)
        this.handleEmployeeTypeChange = this.handleEmployeeTypeChange.bind(this)
    }
    handleEmployeeTypeChange = (value) => {
        this.props.dispatch( setCurrentEmployeeType(value))
    }
    handleCountEmployee = (key,value) => {
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
        const { currentEmployeeType, disabled, deletedEmployeeList } = this.props
        const { handleCountEmployee, handleEmployeeTypeChange } = this
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
                        <CustomButton disabled={disabled} sx={{}} onClick={() => handleEmployeeTypeChange('total_employees')} name={'total_employees'} currentEmployeeType ={currentEmployeeType} >Total employees: {handleCountEmployee("","")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton disabled={disabled} sx={{}} onClick={() => handleEmployeeTypeChange('males')} name={'males'} currentEmployeeType ={currentEmployeeType} >Total males: {handleCountEmployee("gender","male")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton disabled={disabled} sx={{}} onClick={() => handleEmployeeTypeChange('females')} name={'females'} currentEmployeeType ={currentEmployeeType} >Total females: {handleCountEmployee("gender","female")}</CustomButton>
                    </Grid>
                    <Grid sx={{m:0,p:0}} item xs={6} sm={3} md={2}>
                        <CustomButton disabled={disabled} sx={{}} onClick={() => handleEmployeeTypeChange('deleted')} name={'deleted'} currentEmployeeType ={currentEmployeeType} >Deleted: { deletedEmployeeList?.length ?? 0}</CustomButton>
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
    deletedEmployeeList: state?.employeeList?.deletedEmployeeList,
    currentEmployeeType: state?.employeeList?.currentEmployeeType,
  })

const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterEmpolyee)