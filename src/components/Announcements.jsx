import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, Tooltip, Snackbar, Alert, Button, IconButton } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { AssignmentInd, Timeline, Close } from '@mui/icons-material'
import StyledDataGrid from './common/StyledDataGrid'


// Import Actions & Methods
import {getAnnouncements}  from '../redux/actions/announcementsActions'

import dayjs from 'dayjs'

const columns = [      
  { field: 'serial_no', headerName: 'Sl No', minWidth: 50,flex:.3, sortable: false, filter: false, filterable: false },
  { field: 'name', headerName: 'Name', minWidth: 150,flex:1, sortable: false, filter: true, filterable: true },
  { field: 'checked_in_time', headerName: 'Checked In Time', minWidth: 150, flex: 1, sortable: false, filter: false,filterable: false },
  { field: 'announcement', headerName: 'Announcement', minWidth: 250, sortable: false,flex: 1.6, filter: true, filterable: true  },
  { field: 'validation', headerName: 'Validation', minWidth: 100, sortable: false,flex: .6, filter: true, filterable: true  },
]
const rows = [
  {
      "id": 684,
      "name": "tkt-023846-1169",
      "checked_in_time": "AL- HAJ ABDUL JABBER",
      "caller_contact": "01778200359",
      "checked_out_time": "SUVASTU NAZARVALLEY GA-2, SHAJADPUR TOWER-01 3-E1",
      "is_late": "No",
  },
//   {
//     id(pin):75
//     company_id(pin):1
//     user_id(pin):8
//     description(pin):"will be late because of some issues.."
//     created_at(pin):"2022-05-18 09:55:13"
//     updated_at(pin):"2022-05-18 09:55:13"
//     is_from_dashboard(pin):0
//     type(pin):"LATE"
//     name(pin):"Sayantan"
//     id(pin):74
//     company_id(pin):1
//     user_id(pin):10
//     description(pin):"will be late by an hour due to unavoidable personal work"
//     created_at(pin):"2022-05-18 09:37:06"
//     updated_at(pin):"2022-05-18 09:37:06"
//     is_from_dashboard(pin):0
//     type(pin):"LATE"
//     name(pin):"Rubaiya"
//   }
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

  mappedAnnouncements= () => {
    const {announcements} = this.props;

    const announcementInfo = announcements.map((a,i) => {

      return ({
        "id": a.id,
        "serial_no":i+1,
        "name": a.name,
        "checked_in_time": dayjs(a.enter_time).format('YYYY-MM-DD h:mm:ss') ,
        "announcement": a.description,
      })
    })
    //console.log("returing attendace info ", attendanceInfo)
    return announcementInfo
  }

  // Generate Columns & Rows

  // Sort Tasks By Emergency

  // Filter Tasks By Request Date

  // Filter Tasks By Status Type

  // Filter Tasks By Search

  // Open Task Details Dialog

  // Close Task Details Dialog


  render() {
    const {  } = this.props
    const { isTaskDetailsOpen, isTaskTimelineOpen, selectedTask, selectedTimeline, isTimelineLoading, feedback } = this.state
    
   
    let announcement_rows = this.mappedAnnouncements()
    return (
      <Box width='100%' height='84vh'>
        <StyledDataGrid
          columns={columns }
          rows={ announcement_rows }
        />
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
  announcements: state.announcements.announcements,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Announcements)