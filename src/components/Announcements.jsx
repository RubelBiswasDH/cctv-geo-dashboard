import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Stack, Button , FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { ArrowRightAlt } from '@mui/icons-material'
import { DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'
import StyledDataGrid from './common/StyledDataGrid'
import StyledDialog from './common/StyledDialog'
import StyledInputField from './common/StyledInputField'
// Import Actions & Methods
import { getAnnouncement, updateAnnouncement, getAnnouncements}  from '../redux/actions/announcementsActions'

import dayjs from 'dayjs'
import AdapterDayjs from '@mui/lab/AdapterDayjs'

import { setCurrentAnnouncement, setCurrentAnnouncementId, setEditAnnouncementDialogIsOpen } from '../redux/reducers/announcementReducer'
import { setFilterOptions, updateFilterOptions } from '../redux/reducers/announcementReducer'

const columns = [      
  { field: 'name', headerName: 'Name', minWidth: 75,flex:.75, sortable: true, filter: true, filterable: true },
  { field: 'announced_time', headerName: 'Announced At', minWidth: 75, flex: .75, sortable: true, filter: false,filterable: false },
  { field: 'announcement', headerName: 'Announcement', minWidth: 100, sortable: false,flex: 1, filter: true, filterable: true  },
  { field: 'type', headerName: 'Type', minWidth: 50, sortable: true,flex: .5, filter: true, filterable: true  },
  { field: 'edit', headerName: 'Edit', minWidth: 40, sortable: false,flex: .40, filter: false, filterable: false  },
]

class Announcements extends React.PureComponent {
    state = {
      start_date: null,
      end_date: null,
    }

  componentDidMount() {

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    this.setState({ start_date, end_date })

    // Load announcements
    // dispatch( getAnnouncements({start_date: `${start_date}`, end_date: `${end_date}`}) )
  }
  componentWillUnmount(){
    const { dispatch } = this.props
    dispatch(setFilterOptions({}))
  }

     // Handle Date Range Change
     _handleDateRangeChange = dateValues => {
      const { start_date, end_date } = this.state            

      const startDate = dateValues[0]?.$d && dayjs(new Date(dateValues[0]?.$d)).format('YYYY-MM-DD')
      const endDate = dateValues[1]?.$d && dayjs(new Date(dateValues[1]?.$d)).format('YYYY-MM-DD')

      this.setState({ dateValues, start_date: startDate ?? start_date, end_date: endDate ?? end_date })
    }
  
    // Handle Get Data
    _handleOnSubmit = () => {
      const { start_date, end_date } = this.state
      const { dispatch } = this.props
  
      // Load Announcements
      dispatch( getAnnouncements({start_date: `${start_date}`, end_date: `${end_date}`}) )
    }

  _handleCloseAnnouncementDialog = () => {
    const { dispatch } = this.props
    dispatch(setEditAnnouncementDialogIsOpen(false))
    dispatch(setCurrentAnnouncement(''))
    dispatch(setCurrentAnnouncementId(''))
  }

  _handleAnnouncementEdit = (id) => {
    const { dispatch } = this.props
    dispatch( getAnnouncement(id))
  }

  _handleAnnouncementEditSubmit = () => {
    const { dispatch, currentAnnouncement, currentAnnouncementId } = this.props
    const data = {
      description: currentAnnouncement
    }
    dispatch(updateAnnouncement(currentAnnouncementId, data))
  }
  _filteredAnnouncements = () => {
    const { announcements } = this.props;
    const { filterOptions } = this.props
    let list = announcements
    if(filterOptions && filterOptions?.type && filterOptions?.type==='ALL'){
      return list
    }
    if(filterOptions && filterOptions?.type && filterOptions?.type==='LEAVE'){
      list = list.filter( a => a.type==='LEAVE')
    }
    if(filterOptions && filterOptions?.type && filterOptions?.type==='LATE'){
      list = list.filter( a => a.type==='LATE')
    }
    if(filterOptions && filterOptions?.type && filterOptions?.type==='GENERAL'){
      list = list.filter( a => a.type==='GENERAL')
    }
    if(filterOptions && filterOptions?.name){
     list = list.filter( a => a.name.toLowerCase().startsWith(filterOptions.name.toLowerCase()))
    }
    return list
  }
  mappedAnnouncements = () => {
    // const {announcements} = this.props;
    const announcements = this._filteredAnnouncements()
    const announcementInfo = announcements.map((a,i) => {

      return ({
        "id": a?.id,
        "serial_no":i+1,
        "name": a?.name,
        "announced_time": dayjs(a?.created_at).format('YYYY-MM-DD h:mm:ss') ,
        "announcement": a?.description,
        "type":a?.type,
        editAnnouncement: () => {
          this._handleAnnouncementEdit(a?.id)
        }
      })
    })
    return announcementInfo
  }

  render() {
    const { start_date, end_date } = this.state
    const { dispatch, editAnnouncementDialogIsOpen, filterOptions, isDataLoading } = this.props
       
    let announcement_rows = this.mappedAnnouncements()
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
      </Stack>
          <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',p:2,px:0, gap:2}}>
          {/* <Typography sx={{fontSize:'1em'}}>Filter </Typography> */}
          <FormControl size={'small'} fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                sx = {{fontSize: '.75em'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value= {filterOptions?.type ?? 'ALL'}
                label="Type"
                onChange={(e) => dispatch(updateFilterOptions({type:e.target.value}))}
              >                 
                <MenuItem value={"ALL"}>ALL</MenuItem>
                <MenuItem value={"LATE"}>LATE</MenuItem>
                <MenuItem value={"LEAVE"}>LEAVE</MenuItem>
                <MenuItem value={"GENERAL"}>GENERAL</MenuItem>
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
          columns={columns }
          rows={ announcement_rows }
          disableColumnFilter={true}
        />
        <StyledDialog
          title={'Edit Announcement'} 
          isDialogOpen={ editAnnouncementDialogIsOpen } 
          handleDialogOnClose={this._handleCloseAnnouncementDialog}
          footer={
          <>
            <Button onClick={this._handleAnnouncementEditSubmit}>Submit</Button>
          </>
          }
        >
           <StyledInputField multiline={true} minRows={4} maxRows={6} onChange={setCurrentAnnouncement} value={this.props.currentAnnouncement} placeholder={"Edit Announcement"} ariaLabel={""} inputStyle={{m:0,p:1,px:2}} style={{borderRadius:2, boxSizing:'border-box',height:'auto'}}/>
        </StyledDialog>
      </Box>
    )
  }
}
const FilterField = (props) => {
  const { dispatch, action, value, field, label} = props
  return (
    <FormControl fullWidth>
      <TextField
            value={ value } 
            onChange={ 
              e => dispatch(action({ [field]: e.target.value })) } 
            label={label} 
            size={'small'}
            sx = {{fontSize: '.75em'}}
            fullWidth> 
      </TextField>
    </FormControl>
  )
}
// Prop Types
Announcements.propTypes = {
  announcements: PropTypes.array,
  currentAnnouncement: PropTypes.string, 
  editAnnouncementDialogIsOpen: PropTypes.bool,
  currentAnnouncementId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  filterOptions: PropTypes.object,
  dispatch: PropTypes.func,
}

Announcements.defaultProps = {
  announcements: [],
  currentAnnouncement: "", 
  editAnnouncementDialogIsOpen: false,
  currentAnnouncementId: '',
  filterOptions: {},
  dispatch: () => null
}

const mapStateToProps = state => ({
  announcements: state?.announcements?.announcements,
  currentAnnouncement: state?.announcements?.currentAnnouncement,
  editAnnouncementDialogIsOpen: state?.announcements?.editAnnouncementDialogIsOpen,
  currentAnnouncementId:state?.announcements?.currentAnnouncementId,
  filterOptions:state?.announcements?.filterOptions
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Announcements)