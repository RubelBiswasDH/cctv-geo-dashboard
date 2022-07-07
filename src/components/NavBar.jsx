import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import Components
import { Box, AppBar, Toolbar, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, Grid } from '@mui/material'
import { Logout, AccountCircle } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import actions and reducers
import { setIsLeftNavOpen, setCurrentAddress, setAddressOptions } from '../redux/reducers/cctvGeoReducer'
import AddressAutoComplete from './common/AddressAutoComplete'
import { getAddressList } from '../redux/actions/cctvGeoActions'

class NavBar extends React.PureComponent {
    state = {

    }
    componentWillUnmount = ()=> {
      const { dispatch } = this.props
      dispatch(setAddressOptions([]))
    }

    // handleAutoCompInputChange
    _handleAutoCompInputChange = e => {
      const { dispatch } = this.props
      const searchParams = e.target.value
      if(searchParams && searchParams?.length){
        dispatch(getAddressList(searchParams))
      }
      else{
        dispatch(setCurrentAddress({}))
        dispatch(setAddressOptions([]))
      }
  }

    // handleAutoCompChange
    _handleAutoCompChange = (e, value) => {
        const { dispatch } = this.props
        if(value && Object.keys(value)?.length && value?.Address){
          const selectedPointData = {
            ...value,
            isSelectedPoint: true
          }
          dispatch(setCurrentAddress(value?.Address ? selectedPointData : {}))
          dispatch(setAddressOptions([]))
        }

    }

  // Open Account Settings Menu
  _openAccountMenu = e => {
    this.setState({ accMenuAnchorEl: e.currentTarget })
  }

  // Close Account Settings Menu
  _closeAccountMenu = () => {
    this.setState({ accMenuAnchorEl: null })
  }


  // handle left nav open 
  _handleLeftNavOpen = () => {
    const { dispatch } = this.props
    dispatch(setIsLeftNavOpen(true))
  }

  render() {
    const { _handleAutoCompInputChange, _handleAutoCompChange } = this
    const { user, appBarProps, isLeftNavOpen, addressOptions } = this.props
    const { accMenuAnchorEl } = this.state
    const accMenuOpen = Boolean(accMenuAnchorEl)
    return (
      <React.Fragment>
        <AppBar position='sticky' { ...appBarProps }  elevation={1} style={{display:'flex', maxHeight:'50px', zIndex: 1251,justifyContent:'center' }}>
          <Box sx={{ ...appBarStyles }}>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 } sm={ 12 } md={ 8 } sx={{ ...brandContainerStyles,width:'100%' }}>
               
                <Box sx={{display:'flex'}}>
                { !isLeftNavOpen &&
                      <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        size='small'
                        onClick={ this._handleLeftNavOpen }
                        sx={{mr:1}}
                      >
                        <MenuIcon color={"black"} fontSize='small' />
                      </IconButton>
                  }

                </Box>
              </Grid>
              <Grid item xs={ 12 } sm={ 12 } md={ 3.5 } sx ={{display:'flex', alignItems:'center'}}>
                <AddressAutoComplete 
                    filterOptions={addressOptions} 
                    _handleAutoCompInputChange={ _handleAutoCompInputChange } 
                    _handleAutoCompChange = { _handleAutoCompChange }
                />
              </Grid>  
              <Grid item xs={ 12 } sm={ 12 } md={ .5 } >
                <Toolbar variant='dense' sx={ {...toolbarStyles , justifyContent:'flex-end'} }>
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
                      <MoreVertIcon color={"black"}/>
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </Grid>
            </Grid>
          </Box>
        </AppBar>

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
              {'User Name' }
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

const brandContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: { xs: '4px', md: 0 }
}

const toolbarStyles = {
  width: '100%', p: { xs: 0 }
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
  isLeftNavOpen: state?.cctvGeo?.isLeftNavOpen ?? true,
  addressOptions: state?.cctvGeo?.addressOptions ?? []
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)