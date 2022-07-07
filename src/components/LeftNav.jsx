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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Typography  } from '@mui/material';
import _isEqual from 'fast-deep-equal'

// import reducers
import { setIsLeftNavOpen, updateFilterFields, setFilteredCctvData } from '../redux/reducers/cctvGeoReducer'
import StyledDropdown from './common/StyledDropdown';

class LeftNav extends React.PureComponent {

    componentDidMount(){
        this._handleFilterData()
    }

    componentDidUpdate(prevProps){
        const { filterFields } = this.props
        if(!_isEqual(prevProps.filterFields, filterFields)) {
            this._handleFilterData()
        }
    }

    _handleNavClose = () => {
        const { dispatch } = this.props
        dispatch( setIsLeftNavOpen(false) )
    }

    _handleFilterData = () => {
        const { dispatch, filterFields, cctvData } = this.props
        let data = [...cctvData]
        if (filterFields && filterFields?.district){
            if (filterFields?.district === 'All'){
                data = [...data]
                dispatch(setFilteredCctvData(data))
                return
            }
            else{
                data =  data.filter( d => d.district === filterFields.district)
            }
        }
        if (filterFields && filterFields?.thana){
            if (filterFields?.thana === 'All'){
                data = [...data]
            }
            else{
                data = data.filter( d => d.thana === filterFields.thana)
            }   
        }
        if ( filterFields?.district === 'All' &&  filterFields?.thana === 'All') {
            data = [...data]
        }
        dispatch(setFilteredCctvData(data))
    }
    
    render() {
        const { isLeftNavOpen, filterFields, districts, thanas } = this.props
        return(
            <Drawer
                anchor={'left'}
                open={ isLeftNavOpen }
                hideBackdrop={ true }
                variant='persistent'
          >     
            <Box
            sx={{ width: 300,boxSizing:'border-box',height:`calc(100% - ${ 55 }px)`}}
            role="presentation"
            >
                <List sx={{display:'flex',alignItems:'center', width:'100%', height:'50px',p:0,m:0,boxShadow:1}}>
                    <ListItem key={'text'} disablePadding  sx={{display:'flex',justifyContent:'flex-end', maxWidth:'100%',p:0,m:0, height:'100%'}}>
                        <Typography sx={{ display:'flex', width:'80%',pl:0, fontSize:'1em', justifyContent:'center',fontWeight:600}}>CCTV GEO Dashboard</Typography> 
                        <ListItemButton
                            onClick={this._handleNavClose}
                            sx={{display:'flex',width:'10%',height:'100%', justifyContent:'center', alignItems:'center'}}
                        >
                            <ListItemIcon sx={{width:'100%'}}>
                                <ArrowBackIosNewIcon fontSize={'10px'} sx={{width:'100%'}}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List sx={{ p:0, px:1, height:'100%'}}>
                    <ListItem sx={{p:1}}>
                        <StyledDropdown 
                            fullWidth={true}
                            filterOptions={[
                                'All',
                                ...((districts && districts.length)
                                && districts.map( d => d.name))
                            ]} 
                            field={'district'}
                            value={ filterFields?.district || 'All'}
                            action={ updateFilterFields }
                            sx={{flexDirection:'column'}}
                            title={'District'}
                            titleStyle={{fontSize:'.8em',fontWeight:400}} 
                            titleContainerStyle={{pl:.5}}
                        />
                    </ListItem>
                    <ListItem sx={{p:1}}>
                        <StyledDropdown 
                            fullWidth={true}
                            filterOptions={[
                                'All',
                                ...((thanas && thanas.length)
                                && thanas.filter( t => t.district_name === filterFields?.district)?.map( t => t.name))
                            ]
                            } 
                            field={'thana'}
                            value={ filterFields?.thana || 'All'}
                            action={ updateFilterFields }
                            sx={{flexDirection:'column'}} 
                            title={'Thana'}
                            titleStyle={{fontSize:'.8em',fontWeight:400}}
                            titleContainerStyle={{pl:.5}}
                            disabled={ (!filterFields?.district || filterFields?.district === 'All') }
                            />
                    </ListItem>
                </List>
            </Box>
          </Drawer>
        )
    }
 }



// Prop Types
LeftNav.propTypes = {
    dispatch: PropTypes.func,
    isLeftNavOpen: PropTypes.bool,
    filterFields: PropTypes.object,
    districts: PropTypes.array,
    cctvData: PropTypes.array,
}

LeftNav.defaultProps = {
    dispatch: () => null,
    isLeftNavOpen: false,
    filterFields: {},
    districts: [],
    cctvData: []
}

const mapStateToProps = state => ({
    isLeftNavOpen: state?.cctvGeo?.isLeftNavOpen ?? true,
    filterFields: state?.cctvGeo?.filterFields ?? {},
    districts: state?.cctvGeo?.districts ?? [],
    thanas: state?.cctvGeo?.thanas ?? [],
    cctvData: state?.cctvGeo?.cctvData ?? []
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav)