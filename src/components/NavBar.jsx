import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, AppBar, Toolbar, Tooltip, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Badge, Typography, TextField, Autocomplete, Grid, Chip } from '@mui/material'
import { Logout, AccountCircle } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import descoLogo from '../assets/desco-logo.png'
import bkoiLogo from '../assets/barikoi-logo.png'

// Import Actions & Methods
import { logout } from '../redux/actions/authActions'
import { getUserProfile } from '../redux/actions/adminActions'
import { setCurrentView } from '../redux/reducers/dashboardReducer'
import { setUserProfile, setProfileEdit } from "../redux/reducers/adminReducer"
import { setIsLeftNavOpen } from "../redux/reducers/hrtReducer"

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

  _getUserProfile = () => {
        this.props.dispatch(setUserProfile({}))
        this.props.dispatch(setProfileEdit(false))
        this.props.dispatch(getUserProfile(this.state.user.id))
        this.props.dispatch(setCurrentView('profile'))
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

  // Close Notificataions Menu
  _closeNotificataionsMenu = () => {
    this.setState({ notificationsMenuAnchorEl: null })
  }

  // On Logout
  _onLogout = () => {
    const { dispatch } = this.props
    dispatch( logout() )
  }

  // handle left nav open 
  _handleLeftNavOpen = () => {
    const { dispatch } = this.props
    dispatch(setIsLeftNavOpen(true))
  }

  render() {
    const { user, appBarProps, isLeftNavOpen } = this.props
    const { accMenuAnchorEl, notificationsMenuAnchorEl, isTaskDetailsOpen, selectedTask } = this.state
    const accMenuOpen = Boolean(accMenuAnchorEl)
    const notificationsMenuOpen = Boolean(notificationsMenuAnchorEl)
    return (
      <React.Fragment>
        <AppBar position='sticky' { ...appBarProps }   style={{ zIndex: 1251 }}>
          <Box sx={{ ...appBarStyles }}>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 } sm={ 12 } md={ 6 } sx={{ ...brandContainerStyles,width:'100%' }}>
               
                <Box sx={{display:'flex'}}>
                { !isLeftNavOpen &&
                      <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        size='small'
                        onClick={ this._handleLeftNavOpen }
                        sx={{mr:1}}
                      >
                        <MenuIcon color="white" fontSize='small' />
                      </IconButton>
                  }
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

                  {
                    user?.user_type &&
                    <Chip
                        sx={{px:2,mr:1}}                        
                        color='primary'
                        label={ user?.user_type? user.user_type : 'Unassigned' }
                        size={ 'small' }
                    />
                  }
                  
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
                      <MoreVertIcon color={'white'}/>
                      {/* <Avatar
                        { ...this._stringAvatar(user.name) }
                      /> */}
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
  isLeftNavOpen: PropTypes.bool,
  dispatch: PropTypes.func
}

NavBar.defaultProps = {
  user: {},
  appBarProps: {},
  isLeftNavOpen: false,
  dispatch: () => null
}

const mapStateToProps = state => ({
  user: state?.auth?.user,
  isLeftNavOpen: state?.hrt?.isLeftNavOpen,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)