import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import { ArrowRightAlt } from '@mui/icons-material'
import { DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// Import Components
import { Box, Stack, Snackbar, Alert, Button, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'

// Import Actions & Methods
import { stopNotificationSound } from '../utils/utils'
import { setFilterOptions, updateFilterOptions, setUniqueDates } from '../redux/reducers/attendanceReducer'
import { getAttendance, getAttendanceReport }  from '../redux/actions/attendanceActions'

import dayjs from 'dayjs'

import { unionArrayOfObjects } from '../utils/utils'
const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.25, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'present', headerName: 'Present', minWidth: 50,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'late', headerName: 'Late', minWidth: 50,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'absence', headerName: 'Absence', minWidth: 50,flex:1, sortable: false, filter: true, filterable: true },
 ]

class AttendanceList extends React.PureComponent {
 
  state = {
    start_date:null,
    end_date: null,
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
    let date = new Date()
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 0))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    const attendanceList = this.props.attendanceList
    const employeeList = this.props.employeeList

    if(attendanceList && attendanceList.length){
      this.setState({ attendanceList: attendanceList })
      // this.setState({ attendanceList: attendanceWithAbsenceInfo(attendanceList) })
      // attendanceWithAbsenceInfo(attendanceList)
    }
    if(employeeList && employeeList.length){
      this._getUniqueEmployee(employeeList)
    }
    this.setState({ start_date, end_date })
    this._getUniqueDates()
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
      if (this.props.attendanceList !== prevProps.attendanceList) {
        this._getUniqueDates()
      }
    }
  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
  }
  _getUniqueDates = () => {
      const {  attendanceList, dispatch } = this.props
      let dates = []
      if(attendanceList && attendanceList.length){
        attendanceList.forEach(data => {
          dates.push(dayjs(data.enter_time).format("DD/MM/YYYY"))
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
         field: date, headerName: date, minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false,valueGetter: ({ value }) => value || "",

        }
    ))
    return dyanmicColumns
  }

    _filteredAttendance = () => {
      const { attendanceList } = this.props;
      const { filterOptions } = this.props
      let attList = attendanceList
      if(filterOptions && filterOptions?.type && filterOptions?.type==='Late'){
        attList = attList.filter( a => a.is_late)
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='In Time'){
        attList = attList.filter( a => !a.is_late && !a?.is_absent)
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='Absent'){
        attList = attList.filter( a => a?.is_absent)
      }
      if(filterOptions && filterOptions?.type && filterOptions?.type==='All'){
        attList = attList
      }
      if(filterOptions && filterOptions?.name){
       attList = attList.filter( a => a?.name?.toLowerCase().startsWith(filterOptions?.name?.toLowerCase()))
      }
      return attList
    }

  mappedAttendanceInfo = () => {

    const attendanceList  = this._filteredAttendance()
    
    const employeeList = this._getUniqueEmployee(attendanceList)

    const attendanceInfo = employeeList.map((a,i) => {
      
      let individualAttendance = {}
      let p = 0
      let abs = 0
      let l = 0
      const getIndividualAttendance = ( id ) => attendanceList.forEach( a => {
        if (a.user_id === id) {
          if(a.is_absent){
              const date = a?.date
              abs++
              individualAttendance[date] = "A"
          }
          else{
          const enter_time = dayjs(a?.enter_time).format("DD/MM/YYYY")
          if (enter_time) {
            if(a.is_late){
              individualAttendance[enter_time] = "L"
              l++
            }
            else{
              individualAttendance[enter_time] = "P"
              p++
            }
          }
        }
          
        } })

        getIndividualAttendance(a?.user_id)
          return ({
            "id": a?.id,
            "serial_no":i+1,
            "name": a?.name,
            ...individualAttendance,
            'late':l,
            'present':p,
            'absence':abs,
          })

    })
    return attendanceInfo
    
  }

  // Close Task Timeline Dialog
  _closeTaskTimeline = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return

    } else {
      this.setState({ isTaskTimelineOpen: false })
    }
  }

  // On Feedback Close
  _onFeedbackClose = () => {
    this.setState({ feedback: null })

    // Stop Notification Sound
    stopNotificationSound()
  }

  // On Snackbar View Task Click
  _onSnackbarViewTask = task => {
    const { dispatch } = this.props

    // Stop Notification Sound
    stopNotificationSound()


    // Close Feedback
    this._onFeedbackClose()  

    // Open Task Details Dialog with Selected Task
    this.setState({ isTaskDetailsOpen: true, selectedTask: task })  
  }
     // Handle Date Range Change
     _handleDateRangeChange = dateValues => {
      const { start_date, end_date } = this.state            
  
      // Get start date and end date from date range picker
      const startDate = dateValues[0]?.$d && dayjs(new Date(dateValues[0]?.$d)).format('YYYY-MM-DD')
      const endDate = dateValues[1]?.$d && dayjs(new Date(dateValues[1]?.$d)).format('YYYY-MM-DD')
  
      // Set state for start date and end date accordingly
      this.setState({ dateValues, start_date: startDate ?? start_date, end_date: endDate ?? end_date })
    }
  
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendance({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }
    // Handle Report Download
    _handleReportDownload = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
      dispatch( getAttendanceReport({start_date: `${start_date}`, end_date: `${end_date}`}))
     }
  
  render() {
    const { dispatch, isTaskLoading, filterOptions, isDataLoading } = this.props
    const { feedback } = this.state
    const { start_date, end_date } = this.state
    let attendance_rows = this.mappedAttendanceInfo()
    const dyanmicColumns = this._generateAttendanceColumns()
    return (
      <Box width='100%' height='54vh'>
        <Stack spacing={ 1 } direction='row'>
        <LocalizationProvider dateAdapter={ AdapterDayjs }>
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
        </LocalizationProvider>
        <LoadingButton 
            loading={ isDataLoading }
            variant={ 'contained' }
            onClick={ this._handleOnSubmit }
            size={ 'small' }
            disableTouchRipple={ true }                      
        >
            { 'Get Data' }
        </LoadingButton>
        <Button
          onClick={ this._handleReportDownload } 
          variant="contained" 
          endIcon={<FileDownloadOutlinedIcon />}>
          {"Download Report"}
        </Button>
      </Stack>
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',p:2,px:0, gap:2}}>
          {/* <Typography sx={{fontSize:'1em',border:'1px solid black'}}>Filter </Typography> */}
          <FormControl fullWidth sx={{p:0,m:0}} size="small">
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
            value = {filterOptions?.name ?? ''}
            dispatch = {dispatch}
            action = {updateFilterOptions}
          />
        </Box>
        <StyledDataGrid
          columns={[...columns, ...dyanmicColumns  ]}
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
  const { dispatch, action, value, field, label} = props
  return (
    <FormControl size="small" fullWidth>
      <TextField
            value={ value } 
            size="small"
            onChange={ 
              e => dispatch(action({ [field]: e.target.value })) } 
            label={label} 
            fullWidth
            sx = {{fontSize: '.75em'}}
            > 
      </TextField>
    </FormControl>
  )
}
// Prop Types
AttendanceList.propTypes = {
  user: PropTypes.object,
  isTaskLoading: PropTypes.bool,
  tasks: PropTypes.array,
  selectedStatus: PropTypes.string,
  selectedDate: PropTypes.string,
  sndList: PropTypes.array,
  autocompleteSelectedTask: PropTypes.object,
  dispatch: PropTypes.func,
}

AttendanceList.defaultProps = {
  user: {},
  isTaskLoading: false,
  tasks: [],
  selectedStatus: '',
  selectedDate: '',
  sndList: [],
  autocompleteSelectedTask: null,
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  attendanceList: state?.attendanceList?.attendanceList,
  announcements: state?.announcements?.announcements,
  employeeList: state?.employeeList?.employeeList,
  filterOptions: state?.attendanceList?.filterOptions,
  uniqueDates: state?.attendanceList?.uniqueDates,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceList)