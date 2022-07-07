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

import CloseIcon from '@mui/icons-material/Close';
import { Typography  } from '@mui/material';

// import reducers
import { setIsRightNavOpen } from '../redux/reducers/cctvGeoReducer'

class RightNav extends React.PureComponent {
    _handleNavClose = () => {
        const { dispatch } = this.props
        dispatch( setIsRightNavOpen(false) )
    }

    render() {
        const { isRightNavOpen } = this.props
        return(
            <Drawer
                anchor={'right'}
                open={ isRightNavOpen }
                hideBackdrop={ true }
                variant='persistent'
          >
            <Box
            sx={{ width: 300}}
            role="presentation"
            >
                <List sx={{width:'100%'}}>
                    <ListItem key={'text'} disablePadding  sx={{display:'flex',justifyContent:'flex-end', maxWidth:'100%',p:0,m:0}}>
                        <Typography sx={{ display:'flex', width:'70%',pl:0, fontSize:'1em', justifyContent:'center',fontWeight:600}}></Typography> 
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
                    <ListItem sx={{p:1}}>
                       Item 1
                    </ListItem>
                    <ListItem sx={{p:1}}>
                        Item 2
                    </ListItem>
                </List>
            </Box>
          </Drawer>
        )
    }
 }



// Prop Types
RightNav.propTypes = {
    dispatch:PropTypes.func,
    isRightNavOpen: PropTypes.bool,
  }
  
  RightNav.defaultProps = {
    dispatch: () => null,
    isRightNavOpen:false,
  }
  
  const mapStateToProps = state => ({
    isRightNavOpen: state?.cctvGeo?.isRightNavOpen,

  })
  
  const mapDispatchToProps = dispatch => ({ dispatch })
  
  export default connect(mapStateToProps, mapDispatchToProps)(RightNav)