import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { DatePicker, DateRangePicker, LocalizationProvider } from '@mui/lab'

// Import Components
import { Box, Stack, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Divider } from '@mui/material'
import { Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'

// Import Actions & Methods
import { setFilterOptions, updateFilterOptions, setUniqueDates, setCurrentAttendanceTab } from '../redux/reducers/attendanceReducer'
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'
import { setAttendance } from '../redux/reducers/attendanceReducer'
import dayjs from 'dayjs'

import { unionArrayOfObjects } from '../utils/utils'
const columns = {
    "Daily":[      
      { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: true, filter: true, filterable: true },
      { field: 'status', headerName: 'Status', minWidth: 50,flex:1, sortable: true, filter: true, filterable: true },
      { field: 'check_in_time', headerName: 'Check In Time', minWidth: 50,flex:1, sortable: true, filter: true, filterable: true },
      { field: 'check_out_time', headerName: 'Check Out Time', minWidth: 50,flex:1, sortable: true, filter: true, filterable: true },
    ],
    "Monthly":[      
      { field: 'name', headerName: 'Name', minWidth: 200,flex:1, sortable: true, filter: true, filterable: true },
      { field: 'present', headerName: 'Present', minWidth: 100,flex:1, sortable: true, filter: true, filterable: true },  
      { field: 'late', headerName: 'Late', minWidth: 100,flex:1, sortable: true, filter: true, filterable: true },
      { field: 'absent', headerName: 'Absent', minWidth: 100,flex:1, sortable: true, filter: true, filterable: true },        
    ]

  }

class Attendance extends React.PureComponent {
 
  state = {
    start_date:null,
    end_date: null,
    selected_date: null,
    isTaskDetailsOpen: false,
    isTaskTimelineOpen: false,
    selectedTask: {},
    isTimelineLoading: false,
    feedback: null,
    uniqueDates: [],
    uniqueEmployees : [],
    tableColumns: [],
    name_filter: '',
    late_filter: '',
    attendanceList: []
  }

  componentDidMount() {
    const { dispatch } = this.props
    const start_date = dayjs(new Date()).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    const selected_date = dayjs(new Date()).format('YYYY-MM-DD')
    const attendanceList = this.props.attendanceList
    const employeeList = this.props.employeeList

    if(attendanceList && attendanceList.length){
      this.setState({ attendanceList: attendanceList })
    }
    if(employeeList && employeeList.length){
      this._getUniqueEmployee(employeeList)
    }
    this.setState({ start_date, end_date, selected_date })
    dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )

    this._getUniqueDates()
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { selected_date } = this.state
    const start_date = dayjs(new Date()).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')

      if (this.props.attendanceList !== prevProps.attendanceList) {
        this._getUniqueDates()
      }
      if (this.props.currentAttendanceTab !== prevProps.currentAttendanceTab && this.props.currentAttendanceTab === 'Monthly'){
        this.props.dispatch(setAttendance([]))
        this.props.dispatch(setUniqueDates([]))
        this.setState({ start_date, end_date })
      }
      if (this.props.currentAttendanceTab !== prevProps.currentAttendanceTab && this.props.currentAttendanceTab === 'Daily'){
        this.props.dispatch( getAttendance({start_date: `${selected_date}`, end_date: `${selected_date}`}) )
      }
    }
  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
    dispatch(setAttendance([]))
    dispatch(setCurrentAttendanceTab('Daily'))
  }
  _getUniqueDates = () => {
      const {  attendanceList, dispatch } = this.props
      let dates = []
      if(attendanceList && attendanceList.length){
        attendanceList.forEach(data => {
          dates.push(dayjs(data.created_at).format("DD/MM/YYYY"))
        })
        const unique = [...new Set(dates)]
        dispatch(setUniqueDates(unique))
      }
    }
    _getUniqueEmployee = (list) => {
      const employees = unionArrayOfObjects([], list, 'user_id')
      return employees

    }
  _generateAttendanceColumns = () => {
    const { uniqueDates } = this.props
    const dyanmicColumns = uniqueDates.map(
       (date) => ( { 
         field: date, headerName: date, minWidth: 100, flex: 1, sortable: false, filter: false,filterable: false,valueGetter: ({ value }) => value || "",

        }
    ))
    return dyanmicColumns
  }

    _filteredAttendance = () => {

      const { attendanceList } = this.props;
      const { filterOptions } = this.props
      let attList = attendanceList
      if(filterOptions && filterOptions?.type && filterOptions?.type==='All'){
        return attList
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='Late'){
        attList = attList.filter( a => a.is_late)
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='In Time'){
        attList = attList.filter( a => !a.is_late && !a?.is_absent)
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='Absent'){
        attList = attList.filter( a => a?.is_absent)
      }
      if(filterOptions && filterOptions?.name){
       attList = attList.filter( a => a?.name?.toLowerCase().includes(filterOptions?.name?.toLowerCase()))
      }
      return attList
    }

  mappedAttendanceInfo = () => {
    const { currentAttendanceTab } = this.props
    const attendanceList  = this._filteredAttendance()
    
    const employeeList = this._getUniqueEmployee(attendanceList)

    let attendanceInfo = []
    const getAttendanceInfo =  () =>
      employeeList.forEach((a,i) => {
        
        let individualAttendance = {}
        let p = 0
        let abs = 0
        let l = 0
        const getStatus = (a) => {
          if(a.is_absent){
            return 'A'
          }
          else if(a.is_late){
            return 'L'
          }
          else{
            return 'P'
          }
        }
        const getIndividualAttendance = ( id ) => attendanceList.forEach( a => {
          if (a.user_id === id) {
            if(a.is_absent){
                const date = dayjs(a?.created_at).format("DD/MM/YYYY")
                abs++
                individualAttendance[date] = "A"
            }
            else{
            const enter_time = dayjs(a?.enter_time).format("DD/MM/YYYY")
            if (enter_time) {
              if(a.is_late){
                individualAttendance[enter_time] = "L"
                const time = dayjs(a?.enter_time).format('hh:mm A')
                const key = enter_time+'_enter_time'
                individualAttendance[key] = time
                l++
              }
              else{
                individualAttendance[enter_time] = "P"
                const time = dayjs(a?.enter_time).format('hh:mm A')
                const key = enter_time+'_enter_time'
                individualAttendance[key] = time
                p++
              }
            }
          }
            
          } })

        getIndividualAttendance(a?.user_id)

        if(currentAttendanceTab === 'Daily'){
          attendanceInfo = [ 
            ...attendanceInfo,
            {
              "id": a?.id,
              "serial_no":i+1,
              "name": a?.name,
              "check_in_time": a?.enter_time?dayjs(a?.enter_time).format('hh:mm A'):'',
              "check_out_time" : a?.exit_time?dayjs(a?.exit_time).format('hh:mm A'):'',
              "status": getStatus(a),
            }
          ]
        }
        else{
        attendanceInfo = [
          ...attendanceInfo,
          {
          "id": a?.id,
          "serial_no":i+1,
          "name": a?.name,
          ...individualAttendance,
          'late':l,
          'present':p,
          'absent':abs,
        }]
      }

      })
    getAttendanceInfo()
    return attendanceInfo
    
  }


  // On Feedback Close
  _onFeedbackClose = () => {
    this.setState({ feedback: null })
  }

  // On Snackbar View Task Click
  _onSnackbarViewTask = task => {

    // Close Feedback
    this._onFeedbackClose()  

    // Open Task Details Dialog with Selected Task
    this.setState({ isTaskDetailsOpen: true, selectedTask: task })  
  }
     // Handle Date Range Change
     _handleDateRangeChange = dateValues => {
      const { dispatch } = this.props
      const { start_date, end_date } = this.state            
  
      // Get start date and end date from date range picker
      const startDate = dateValues[0]?.$d && (dayjs(new Date(dateValues[0]?.$d)).format('YYYY-MM-DD') || start_date)
      const endDate = dateValues[1]?.$d && (dayjs(new Date(dateValues[1]?.$d)).format('YYYY-MM-DD') || end_date)
  
      // Set state for start date and end date accordingly
      this.setState({ dateValues, start_date: startDate ?? start_date, end_date: endDate ?? end_date })

      if( startDate && endDate){
        dispatch( getAttendance({start_date: `${startDate}`, end_date: `${endDate}`}) )
      }

    }
  
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }
    _handleDateChange = date => {
        const { dispatch } = this.props
        const { selected_date } = this.state
        const selectedDate = date?.$d && (dayjs(new Date(date?.$d)).format('YYYY-MM-DD') || selected_date)
        this.setState({ date, selected_date: selectedDate ?? selected_date })
        dispatch( getAttendance({start_date: `${selectedDate}`, end_date: `${selectedDate}`}) )
    }
    // Handle Report Download
    _handleReportDownload = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendanceReport({start_date: `${start_date}`, end_date: `${end_date}`}))
     }
  
  render() {
    const { dispatch, isTaskLoading, filterOptions, currentAttendanceTab } = this.props
    const { feedback } = this.state
    const { selected_date, start_date, end_date } = this.state
    const date = selected_date
    let attendance_rows = this.mappedAttendanceInfo()
    const dyanmicColumns = this._generateAttendanceColumns()
    return (
      <Box width='100%' height='72vh'>
        <Box sx={{py:2}}>
            <Typography
                variant='h4'
            >
                Attendance
            </Typography>
        </Box>
        <Stack sx={{mb:3}} spacing={ 1 } direction='row'>
            <LocalizationProvider dateAdapter={ AdapterDayjs }>
              { currentAttendanceTab === 'Daily' && (
                <DatePicker
                    value = { date }
                    onChange={ this._handleDateChange }
                    disableMaskedInput={ true }
                    inputFormat={ 'DD-MM-YYYY' }
                    renderInput={(params) => (                                            
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField {...params} size={ 'small' } fullWidth={ true } />
                        </Box>                                            
                    
                    )}
                    PopperProps={{
                    placement: 'bottom-start',
                    }}
                    onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
                />
              )
                  }
              { currentAttendanceTab === 'Monthly' && (
                <DateRangePicker
                value={ [ start_date, end_date ] }
                onChange={ this._handleDateRangeChange }
                disableMaskedInput={ true }
                inputFormat={ 'DD-MMM-YYYY' }
                renderInput={(startProps, endProps) => (                                            
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField {...startProps} size={ 'small' } fullWidth={ true } />
                            <ArrowRightAlt />
                            <TextField {...endProps} size={ 'small' } fullWidth={ true } />
                        </Box>                                            
                    
                )}
                PopperProps={{
                  placement: 'bottom-start',
                }}
                onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
            />
              )
                  }

            </LocalizationProvider>
            <FormControl fullWidth={false} sx={{p:0,m:0,width:'30%'}} size="small">
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value= {filterOptions?.type ?? 'All'}
                    label="Type"
                    onChange={(e) => dispatch(updateFilterOptions({type:e.target.value}))}
                    sx = {{fontSize: '.75em'}}
                >                 
                    <MenuItem value={"All"}>All</MenuItem>
                    <MenuItem value={"Absent"}>Absent</MenuItem>
                    <MenuItem value={"Late"}>Late</MenuItem>
                    <MenuItem value={"In Time"}>In Time</MenuItem>
                </Select>
            </FormControl>
            <FilterField
                field = {'name'}
                label = {'Name'} 
                fullWidth={false}
                value = {filterOptions?.name ?? ''}
                dispatch = {dispatch}
                action = {updateFilterOptions}
                sx={{width:'30%'}}
            />

            <Box sx={{
                ml:'auto',
                display: 'flex',
                alignItems: 'center',
                width: '30%',
                justifyContent:'flex-end'
                }}>
                <TabSwitchButton 
                    value={'Daily'} 
                    action={setCurrentAttendanceTab} 
                    dispatch={dispatch}
                    isActive={ currentAttendanceTab === 'Daily' }
                />
                <Divider orientation={'vertical'}></Divider>
                <TabSwitchButton 
                    value={'Monthly'} 
                    action={setCurrentAttendanceTab} 
                    dispatch={dispatch} 
                    isActive={ currentAttendanceTab === 'Monthly' }
                />
            </Box>
      </Stack>

        <StyledDataGrid
          columns={currentAttendanceTab==='Daily'?[ ...columns['Daily'] ]:[...columns["Monthly"], ...dyanmicColumns  ]}
          rows={ attendance_rows }
          disableColumnFilter={true}
          loading={ isTaskLoading }
        />

        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          open={ Boolean(feedback) }
          autoHideDuration={ 10000 }
        >
          <Alert
            severity={ feedback?.status === 200 ? 'success' : 'error' }
            onClose={ this._onFeedbackClose }
            sx={{ width: '100%' }}
            action={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Button
                  color='inherit'
                  size='small'
                  onClick={ () => this._onSnackbarViewTask(feedback?.task) }
                >
                  { 'View Task' }
                </Button>

                <IconButton
                  onClick={ this._onFeedbackClose }
                  size='small'
                  sx={{ padding: 0 }}
                >
                  <Close fontSize='small' />
                </IconButton>
              </Box>
            }
          >
            { feedback?.message ? feedback.message : '' }
          </Alert>
        </Snackbar>
      </Box>
    )
  }
}

const FilterField = (props) => {
  const { dispatch, action, value, field, label, fullWidth, sx } = props
  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{...sx}}>
      <TextField
            value={ value } 
            size="small"
            onChange={ 
              e => dispatch(action({ [field]: e.target.value })) } 
            label={label} 
            fullWidth={fullWidth}
            sx = {{fontSize: '.75em'}}
            > 
      </TextField>
    </FormControl>
  )
}

const TabSwitchButton = (props) => {
    const { value, dispatch, action, isActive } = props
    const textStyle = {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
        textAlign: 'center',
        letterSpacing:' 0.4px',
        textTransform: 'uppercase',
        color:'rgba(0, 0, 0, 0.38)',
        px:2,
        borderBottom: '2px solid transparent'
    }
    const activeBtnStyle = isActive?{
        color: '#007AFF',
        borderBottom: '2px solid #007AFF'
    }:
    {}
    const handleClick = () => {
        dispatch(action(value))
    }
    return (
        <Button onClick={handleClick} variant="text"><Typography sx={{ ...textStyle, ...activeBtnStyle }}>{value}</Typography></Button>
    )
}
// Prop Types
Attendance.propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    currentAttendanceTab: PropTypes.string,
    isTaskLoading: PropTypes.bool,
    tasks: PropTypes.array,
    selectedStatus: PropTypes.string,
    selectedDate: PropTypes.string,
    sndList: PropTypes.array,
    autocompleteSelectedTask: PropTypes.object,
}

Attendance.defaultProps = {
  dispatch: () => null,
  user: {},
  currentAttendanceTab:'Daily',
  isTaskLoading: false,
  tasks: [],
  selectedStatus: '',
  selectedDate: '',
  sndList: [],
  autocompleteSelectedTask: null,
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  attendanceList: state?.attendanceList?.attendanceList,
  announcements: state?.announcements?.announcements,
  employeeList: state?.employeeList?.employeeList,
  filterOptions: state?.attendanceList?.filterOptions,
  uniqueDates: state?.attendanceList?.uniqueDates,
  currentAttendanceTab: state?.attendanceList?.currentAttendanceTab,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Attendance)