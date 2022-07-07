import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


class StyledDropdown extends React.PureComponent {

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e) => {
        const { dispatch, action, subField, field } = this.props
        e.preventDefault()
        if (subField && subField?.length) {
            dispatch(action({
                [ subField ]: e.target.value
            }))
        }
        else if ( field && field?.length){
            dispatch(action({ [field]: e.target.value }))
        }
        else{
            dispatch(action(e.target.value))
        }
    }

    render() {
        const { value, filterOptions, title, label, titleContainerStyle, fieldStyle, titleStyle, fullWidth, sx, disabled } = this.props
        const { handleChange } = this;
    
            return (
                <Grid xs={12} item sx={{display:'flex',gap:0, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start',...sx }}>
                { title && 
                    <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle }}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle, ...titleStyle}}>{title}</Typography>
                    </Box>
                }
                <FormControl disabled={disabled} fullWidth={fullWidth} sx={{p:0,m:0,width:'100%', ...fieldStyle}} size="small">
                    { label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value= { value || 'None' }
                        label=""
                        onChange={handleChange}
                        sx = {{fontSize: '.6em', py:0}}
                    >    
                        {(filterOptions && filterOptions.length)
                            ?filterOptions.map(d => (<MenuItem sx={{fontSize:'.6em',py:.5}} key={d} value={d}>{d}</MenuItem>))
                            :<MenuItem sx={{fontSize:'.6em',py:.5}} key={"None"} value={"None"}>{'None'}</MenuItem>}            
                    </Select>
                </FormControl>
            </Grid>
            
            );
    }
}

const textStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
}

// Prop Types
StyledDropdown.propTypes = {
    value:PropTypes.any, 
    filterOptions: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.string, 
    titleContainerStyle: PropTypes.object,
    fieldStyle: PropTypes.object, 
    titleStyle: PropTypes.object,
    fullWidth: PropTypes.bool,
    sx: PropTypes.object, 
    disabled: PropTypes.bool ,
  }
  
  StyledDropdown.defaultProps = {
    value:'', 
    filterOptions: [],
    title: '',
    label: '', 
    titleContainerStyle: {},
    fieldStyle: {}, 
    titleStyle: {},
    fullWidth: false,
    sx: {}, 
    disabled: false ,
    }

  const mapDispatchToProps = dispatch => ({ dispatch })
  export default connect(mapDispatchToProps)(StyledDropdown)