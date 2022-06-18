import React from 'react'
import { connect } from 'react-redux'

import { Grid, Box, Typography, FormControl, Select, MenuItem } from '@mui/material';


class StyledDripdown extends React.PureComponent {

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
        // const {placeholder, ariaLabel, style, field, value, onChange, inputStyle, dispatch, ...rest} = this.props;
        // const { title, value, field, subField, dispatch, style, fieldStyle, titleStyle } = this.props
        const { dispatch, action, value, field, subField, filterOptions, title, fieldStyle, fullWidth, sx } = this.props

        const { handleChange } = this;
    
            return (
                <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
                { title && 
                    <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%'}}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...textStyle}}>{title}</Typography>
                    </Box>
                }
                <FormControl fullWidth={false} sx={{p:0,m:0,width:'30%', ...fieldStyle}} size="small">
                        {/* <InputLabel id="demo-simple-select-label">''</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value= { value ?? filterOptions[0] }
                            label=""
                            onChange={handleChange}
                            sx = {{fontSize: '.75em'}}
                        >    
                            {filterOptions.map(d => (<MenuItem key={d} value={d}>{d}</MenuItem>))}            
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
  export default connect(mapDispatchToProps)(StyledDripdown)
