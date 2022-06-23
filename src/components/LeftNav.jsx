import * as React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography  } from '@mui/material';

// import reducers
import { setIsLeftNavOpen } from '../../src/redux/reducers/hrtReducer'
import { setCurrentView } from '../../src/redux/reducers/dashboardReducer'
// import actions
import { setView } from '../utils/utils'

const navOptions = [
    {
        'label':"Company Profile",
        'value': "company_profile",
        'icon' : <EmojiTransportationIcon/>,
    },
    {
        'label': "Attendance",
        'value': "attendance",
        'icon' : <FactCheckIcon/>,
    },
    {
        'label': "Announcements",
        'value': "announcements",
        'icon' : <AddAlertIcon/>,
    },
    {
        'label':"Employee Profile",
        'value': "employee_profile",
        'icon' : <PersonIcon/>,
    },
    {
        'label':"Add User",
        'value': "add_user",
        'icon' : <PersonAddIcon/>,
    } ,
    {
        'label': "Company Settings",
        'value' : "company_settings",
        'icon' : <SettingsIcon/>,
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
          >
            <Box
            sx={{ width: 250}}
            role="presentation"
            >
                <List sx={{width:'100%'}}>
                    <ListItem key={'text'} disablePadding  sx={{display:'flex',justifyContent:'flex-end', maxWidth:'100%',p:0,m:0}}>
                        <Typography sx={{ display:'flex', width:'70%',pl:0, fontSize:'1.4em', justifyContent:'center',fontWeight:600}}>HR Trace</Typography> 
                        <ListItemButton
                            onClick={this._handleNavClose}
                            sx={{display:'flex', width:'10%',p:0}}
                        >
                            <ListItemIcon sx={{width:'100%'}}>
                                <CloseIcon  sx={{width:'100%'}}/>
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
                            {option?.icon || <StarIcon />}
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