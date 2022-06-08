import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { AssignmentInd, Timeline, Close } from '@mui/icons-material'
import TextField from '@mui/material/TextField';

import StyledDataGrid from './common/StyledDataGrid'
import StyledDialog from './common/StyledDialog'
import StyledInputField from './common/StyledInputField'
// Import Actions & Methods
import { getAnnouncement, updateAnnouncement, getAnnouncements}  from '../redux/actions/announcementsActions'

import dayjs from 'dayjs'
import { setCurrentAnnouncement, setCurrentAnnouncementId, setEditAnnouncementDialogIsOpen } from '../redux/reducers/announcementReducer'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 25,flex:.25, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 75,flex:.75, sortable: false, filter: true, filterable: true },
  { field: 'announced_time', headerName: 'Announced At', minWidth: 75, flex: .75, sortable: false, filter: false,filterable: false },
  { field: 'announcement', headerName: 'Announcement', minWidth: 100, sortable: false,flex: 1, filter: true, filterable: true  },
  { field: 'type', headerName: 'Type', minWidth: 50, sortable: true,flex: .5, filter: true, filterable: true  },
  { field: 'edit', headerName: 'Edit', minWidth: 40, sortable: false,flex: .40, filter: false, filterable: false  },
]

class Announcements extends React.PureComponent {
    state = {
    }

  componentDidMount() {
    const { dispatch } = this.props

    let date = new Date()
      
    const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
    const end_date = dayjs(new Date()).format('YYYY-MM-DD')
    this.setState({ start_date, end_date })

    // Load announcements
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

  mappedAnnouncements = () => {
    const {announcements} = this.props;
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
    const { editAnnouncementDialogIsOpen } = this.props
    const { isTaskDetailsOpen, isTaskTimelineOpen, selectedTask, selectedTimeline, isTimelineLoading, feedback } = this.state
    
   
    let announcement_rows = this.mappedAnnouncements()
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={columns }
          rows={ announcement_rows }
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
           <StyledInputField multiline={true} minRows={4} maxRows={6} onChange={setCurrentAnnouncement} value={this.props.currentAnnouncement} placeholder={"Edit Announcement"} ariaLabel={""} inputStyle={{m:0,p:1,px:2}} style={{borderRadius:2,height:'10vh', boxSizing:'border-box',height:'auto'}}/>
        </StyledDialog>
      </Box>
    )
  }
}

// Prop Types
Announcements.propTypes = {
  announcement: PropTypes.array,
  dispatch: PropTypes.func,
}

Announcements.defaultProps = {
  announcements: [],
  dispatch: () => null
}

const mapStateToProps = state => ({
  announcements: state?.announcements?.announcements,
  currentAnnouncement: state?.announcements?.currentAnnouncement,
  editAnnouncementDialogIsOpen: state?.announcements?.editAnnouncementDialogIsOpen,
  currentAnnouncementId:state?.announcements?.currentAnnouncementId,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Announcements)