import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

// Import Components
import { Box, AppBar, Toolbar, Tooltip, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Badge, Typography, TextField, Autocomplete, Grid, Chip } from '@mui/material'
import { Logout, AccountCircle, Notifications, Assignment, Check, Task, AssignmentLate, Search } from '@mui/icons-material'

// Import Assets
// import descoLogo from '../assets/desco-logo.png'
import bkoiLogo from '../assets/barikoi-logo.png'

// Import Actions & Methods
import { logout } from '../redux/actions/authActions'
import { sendTaskClickCount } from '../redux/actions/taskActions'
import { updatePushNotification, setSearchQuery, setAutocompleteSelectedTask, setSelectedDate, setSelectedStatusType } from '../redux/reducers/taskReducer'
import { playNotificationSound, stopNotificationSound } from '../utils/utils'
import {getUserProfile} from '../redux/actions/adminActions'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import {setUserProfile, setProfileEdit} from "../redux/reducers/adminReducer"
import { setView } from '../utils/utils'

class NavBar extends React.PureComponent {
  state = {
    accMenuAnchorEl: null,
    notificationsMenuAnchorEl: null,
    isTaskDetailsOpen: false,
    selectedTask: {},
    filterOptions: ['option1','option2','option3'],
    user: {}
  }
  componentDidMount = ()=> {
    const user = JSON.parse(localStorage.getItem('user'))
    this.setState({user:user})
  }
  componentDidUpdate = (prevProps) => {
    const { pushNotifications } = this.props

    // Check if there is a new push notification
    if (pushNotifications.length > prevProps.pushNotifications.length) {

      // Check if the notification is for an emergency task
      if (pushNotifications[0]?.task?.is_emergency === 1) {
        // Play emergency notification sound
        playNotificationSound('emergency')
      } else {
        // Play normal notification sound
        playNotificationSound()
      }
    }    
  }
  _getUserProfile = () => {
        this.props.dispatch(setUserProfile({}))
        this.props.dispatch(setProfileEdit(false))
        this.props.dispatch(getUserProfile(this.state.user.id))
        this.props.dispatch(setCurrentView('profile'))
        // setView('profile')
  }
  // Get Avatar String
  _stringAvatar = name => ({
    sx: {
      width: '32px',
      height: '32px'
    },
    children: name ? name.split(' ').map(d => d.trim()[0].toUpperCase()).join('') : null
  })

  // Open Account Settings Menu
  _openAccountMenu = e => {
    this.setState({ accMenuAnchorEl: e.currentTarget })
  }

  // Close Account Settings Menu
  _closeAccountMenu = () => {
    this.setState({ accMenuAnchorEl: null })
  }

  // Open Notificataions Menu
  _openNotificataionsMenu = e => {
    this.setState({ notificationsMenuAnchorEl: e.currentTarget })

    // Stop notification sound
    stopNotificationSound() 
  }

  // Close Notificataions Menu
  _closeNotificataionsMenu = () => {
    this.setState({ notificationsMenuAnchorEl: null })
  }

  // On Logout
  _onLogout = () => {
    const { dispatch } = this.props
    dispatch( logout() )
  }

  // On Notification Click
  _onNotificationClick = notification => {
    const { dispatch, tasks } = this.props
    dispatch( updatePushNotification({ ...notification, opened: true }) )

    // Open Task Details Dialog
    const task = tasks.find(t => t.id === notification.task.id)    
    this._openTaskDetails(task ?? {})
  }

  // Open Task Details Dialog
  _openTaskDetails = selectedTask => {
    const { user, sndList } = this.props

    // Selected SND
    const snd = sndList.find(s => s.snd.id === selectedTask.snd_id)?.snd?.snd_name ?? ''

    this.setState({ isTaskDetailsOpen: true, selectedTask: { ...selectedTask, snd } })

    // Send Task Click Count
    if(selectedTask.id && user.user_type === 'HR') {
      sendTaskClickCount(selectedTask.id)
    }
  }

  // Close Task Details Dialog
  _closeTaskDetails = () => {
    this.setState({ isTaskDetailsOpen: false, selectedTask: {} })
  }

  // Sort Norifications By Emergency
  _sortByEmergency = notifications => {
    if(!notifications) {
      return []
    }

    return [ ...notifications ].sort((n1, n2) => {
      const n1Em = n1?.task?.is_emergency ?? 0
      const n2Em = n2?.task?.is_emergency ?? 0

      return n2Em - n1Em
    })
  }

  // On Search Input Change

  // On Autocomplete Select Change

  // On Autocomplete Filter

  
  render() {
    const { user, appBarProps, pushNotifications, searchQuery, tasks, autocompleteSelectedTask } = this.props
    const { accMenuAnchorEl, notificationsMenuAnchorEl, isTaskDetailsOpen, selectedTask } = this.state
    const accMenuOpen = Boolean(accMenuAnchorEl)
    const notificationsMenuOpen = Boolean(notificationsMenuAnchorEl)
    const sortedPushNotifications = this._sortByEmergency(pushNotifications)
    return (
      <React.Fragment>
        <AppBar position='sticky' { ...appBarProps }   style={{ zIndex: 1251 }}>
          <Box sx={ appBarStyles }>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 } sm={ 12 } md={ 6 } sx={ brandContainerStyles }>
                <Box>
                  <a href='/'>
                    <img
                      src={ bkoiLogo }
                      alt='Brand Logo'
                      height='32px'
                      style={ imgStyles }
                    />
                  </a>
                </Box>

                <Typography
                  variant='h5'
                  color='text.secondary'
                  sx={ brandTextStyles }
                >
                  { 'HR Trace Dashboard' }
                </Typography>
              </Grid>

              <Grid item xs={ 12 } sm={ 12 } md={ 6 } >
                <Toolbar variant='dense' sx={ {...toolbarStyles , justifyContent:'flex-end'} }>
                  {/* <Autocomplete
                    fullWidth={ true }
                    size='small'
                    popupIcon={ <Search fontSize='small' /> }
                    openOnFocus={ false }
                    options={ this.state.filterOptions }
                    getOptionLabel={ o => o?.ticket_number ?? '' }
                    filterOptions={ x => (x)}
                    value={ autocompleteSelectedTask }
                    inputValue={ searchQuery }
                    onChange={ () => console.log('Autocopmplete changed') }
                    onInputChange={ () => console.log('onInputChange') }
                    sx={ autocompleteStyles }
                    renderInput={params =>
                      <TextField
                        { ...params }
                        variant='outlined'
                        margin='none'
                        size='small'
                        fullWidth={ true }
                        type='text'
                        placeholder='Search tickets...'
                      />
                    }
                  /> */}

                  {
                    user?.user_type &&
                    <Chip
                        sx={{px:2,mr:1}}                        
                        color='primary'
                        label={ user?.user_type? user.user_type : 'Unassigned' }
                        size={ 'small' }
                    />
                  }
                  
                  {/* <Tooltip
                    title={ 'Notifications' }
                    arrow={ true }
                  >
                    <IconButton
                      size='small'
                      aria-controls={
                        notificationsMenuOpen ? 'notifications-menu' : undefined
                      }
                      aria-haspopup='true'
                      aria-expanded={ notificationsMenuOpen ? 'true' : undefined }
                      onClick={ this._openNotificataionsMenu }
                    >
                      <Badge
                        badgeContent={ sortedPushNotifications.filter(n => !n.opened).length }
                        color='primary'
                        overlap='circular'
                      >
                        <Avatar
                          sx={{
                            width: '32px',
                            height: '32px'
                          }}
                        >
                          <Notifications />
                        </Avatar>
                      </Badge>
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip
                    title={ user.name ? user.name : 'Account Settings' }
                    arrow={ true }
                  >
                    <IconButton
                      size='small'
                      aria-controls={ accMenuOpen ? 'account-settings-menu' : undefined }
                      aria-haspopup='true'
                      aria-expanded={ accMenuOpen ? 'true' : undefined }
                      onClick={ this._openAccountMenu }
                    >
                      <Avatar
                        { ...this._stringAvatar(user.name) }
                      />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </Grid>
            </Grid>
          </Box>
        </AppBar>

        <React.Fragment>
          <Menu
            anchorEl={ notificationsMenuAnchorEl }
            id='notifications-menu'
            open={ notificationsMenuOpen }
            onClose={ this._closeNotificataionsMenu }
            onClick={ this._closeNotificataionsMenu }
            PaperProps={ menuPaperProps }
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            MenuListProps={{
              sx: {
                padding: 0
              }
            }}
          >
            <Box maxHeight='240px' overflow='auto'>
              { sortedPushNotifications && sortedPushNotifications.length > 0 ?
                  sortedPushNotifications.map((n, i) =>
                    <MenuItem
                      key={ i }
                      dense={ true }
                      selected={ n.opened ? false : true }
                      onClick={ () => this._onNotificationClick(n) }
                    >
                      <Tooltip
                        title={
                          n.task?.status === 'RESOLVED' ?
                            'Resolved'
                            :
                            n.task?.is_emergency ?
                            'Emergency'
                            :
                            'Opened'
                        }
                      >
                        <ListItemIcon>
                          { n.task?.status === 'RESOLVED' ?
                            <Task fontSize='small' />
                            :
                            n.task?.is_emergency ?
                            <AssignmentLate fontSize='small' color='error' />
                            :
                            <Assignment fontSize='small' />
                          }
                        </ListItemIcon>
                      </Tooltip>
                      <Box width='100%'>
                        <Typography variant='body2'>{ n.title }</Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          textAlign='end'
                          sx={{ fontSize: '9px' }}
                        >
                          { n.time }
                        </Typography>
                      </Box>
                    </MenuItem>
                  )
                  :
                  <MenuItem
                    dense={ true }
                  >
                    <ListItemIcon>
                      <Check fontSize='small' />
                    </ListItemIcon>
                    { 'Empty' }
                  </MenuItem>
              }
            </Box>
          </Menu>
        </React.Fragment>

        <React.Fragment>
          <Menu
            anchorEl={ accMenuAnchorEl }
            id='account-settings-menu'
            open={ accMenuOpen }
            onClose={ this._closeAccountMenu }
            onClick={ this._closeAccountMenu }
            PaperProps={ menuPaperProps }
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              dense={ true }
              onClick={this._getUserProfile}
            >
              <ListItemIcon>
                <AccountCircle fontSize='small' />
              </ListItemIcon>
              { (this.state.user.username)?this.state.user.username:'User Name' }
            </MenuItem>
            <MenuItem
              dense={ true }
              onClick={ this._onLogout }
            >
              <ListItemIcon>
                <Logout fontSize='small' />
              </ListItemIcon>
              { 'Logout' }
            </MenuItem>
          </Menu>
        </React.Fragment>
      </React.Fragment>
    )
  }
}

// Props & Styles
const menuPaperProps = {
  elevation: 0,
  sx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 1
    }
  }
}

const appBarStyles = {
  padding: '0.5rem 1rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const imgStyles = {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  objectFit: 'fill'
}

const brandContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: { xs: '4px', md: 0 }
}

const brandTextStyles = {
  fontSize: { xs: '18px', sm: '20px', md: '24px'}
}

const toolbarStyles = {
  width: '100%', p: { xs: 0 }
}

const autocompleteStyles = {
  ml: 'auto',
  marginRight: '8px',
  width: '100%',
  maxWidth: {
    md: '50%',
    xs: '100%'
  },
  '& .MuiAutocomplete-popupIndicator': {
    transform: 'none'
  }
}

// Prop Types
NavBar.propTypes = {
  user: PropTypes.object,
  appBarProps: PropTypes.object,
  pushNotifications: PropTypes.array,
  searchQuery: PropTypes.string,
  tasks: PropTypes.array,
  autocompleteSelectedTask: PropTypes.object,
  sndList: PropTypes.array,
  dispatch: PropTypes.func
}

NavBar.defaultProps = {
  user: {},
  appBarProps: {},
  pushNotifications: [],
  searchQuery: '',
  tasks: [],
  autocompleteSelectedTask: null,
  sndList: [],
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state.auth.user,
  pushNotifications: state.task.pushNotifications,
  searchQuery: state.task.searchQuery,
  tasks: state.task.tasks,
  autocompleteSelectedTask: state.task.autocompleteSelectedTask,
  sndList: state.task.sndList
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)