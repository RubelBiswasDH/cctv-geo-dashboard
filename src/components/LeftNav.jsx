import * as React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import { Typography  } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// import reducers
import { setIsLeftNavOpen } from '../../src/redux/reducers/hrtReducer'
import { setCurrentView } from '../../src/redux/reducers/dashboardReducer'
// import actions
import { setView } from '../utils/utils'

const navOptions = [
    {
        'label':"Company Profile",
        'value': "company_profile"
    },
    {
        'label': "Attendance",
        'value': "attendance"
    },
    {
        'label': "Announcements",
        'value': "announcements"
    },
    {
        'label':"Employee Profile",
        'value': "employee_profile"
    },
    {
        'label':"Add User",
        'value': "add_user"
    } ,
    {
        'label': "Company Settings",
        'value' : "company_settings"
    }
]

class LeftNav extends React.PureComponent {
    _handleNavClose = () => {
        const { dispatch } = this.props
        dispatch( setIsLeftNavOpen(false) )
    }
    _handleSelectMenu = (value) => {
        const { dispatch } = this.props
        dispatch(setCurrentView(value))
        setView(value)
    }
    render() {
        const { isLeftNavOpen, currentView } = this.props
        return(
            <Drawer
                anchor={'left'}
                open={ isLeftNavOpen }
                hideBackdrop={ true }
                variant='persistent'
            // onClose={toggleDrawer(anchor, false)}
          >
            <Box
            sx={{ width: 250 }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            >
                <List>
                    <ListItem key={'text'} disablePadding  sx={{display:'flex',justifyContent:'flex-end', width:'100%'}}>
                        <Typography sx={{ display:'flex', width:'80%',pl:1, fontSize:'1.4em', justifyContent:'center',fontWeight:600}}>HR Trace</Typography> 
                        <ListItemButton
                            onClick={this._handleNavClose}
                            sx={{display:'flex', width:'20%'}}
                        >
                            <ListItemIcon>
                                <CloseIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {navOptions.map((option, index) => (
                    <ListItem key={option?.label} disablePadding>
                        <ListItemButton
                            onClick = { () => this._handleSelectMenu(option.value) }
                            sx={{
                                background: (currentView === option.value)?'#ADD8E6':''
                            }}
                        >
                        <ListItemIcon>
                            <StarIcon/>
                        </ListItemIcon>
                        <ListItemText primary={option?.label} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </Box>
          </Drawer>
        )
    }
 }



// Prop Types
LeftNav.propTypes = {
    dispatch:PropTypes.func,
    isLeftNavOpen: PropTypes.bool,
  }
  
  LeftNav.defaultProps = {
    dispatch: () => null,
    isLeftNavOpen:false,
  }
  
  const mapStateToProps = state => ({
    isLeftNavOpen: state?.hrt?.isLeftNavOpen,
    currentView: state?.dashboard?.currentView
  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(LeftNav)