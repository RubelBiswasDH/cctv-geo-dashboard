import React from 'react'
import { connect } from 'react-redux'

import { Grid, Box, Typography, FormControl, Select, MenuItem } from '@mui/material';


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
        else {
            dispatch(action({ [field]: e.target.value }))
        }
    }

    render() {
        const { value, filterOptions, title, titleContainerStyle, fieldStyle, fullWidth, sx, disabled } = this.props
        const { handleChange } = this;
    
            return (
                <Grid xs={12} item sx={{display:'flex',gap:0, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start',...sx }}>
                { title && 
                    <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle }}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
                    </Box>
                }
                <FormControl disabled={disabled} fullWidth={fullWidth} sx={{p:0,m:0,width:'30%', ...fieldStyle}} size="small">
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value= { value ?? filterOptions[0] }
                            label=""
                            onChange={handleChange}
                            sx = {{fontSize: '.75em'}}
                        >    
                            {filterOptions.map(d => (<MenuItem 
                                key={(typeof(d)==="string")?d:d.name} 
                                value={(typeof(d)==="string")?d:d.value}>
                                    {(typeof(d)==="string")?d:d.name}
                                </MenuItem>))}            
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

  const mapDispatchToProps = dispatch => ({ dispatch })
  export default connect(mapDispatchToProps)(StyledDropdown)
