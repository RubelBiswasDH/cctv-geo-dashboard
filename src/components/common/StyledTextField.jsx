import React from 'react'
import { connect } from 'react-redux'
import { Grid, Box, Typography, InputBase, FormControl } from '@mui/material';

class StyledTextField extends React.PureComponent {

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
        else if(field && field?.length) {
            dispatch(action({ [field]: e.target.value }))
        }
        else{
            dispatch(action(e.target.value))
        }
    }

    _handleKeyDown = (e) => {
        const { onEnterKeyDown } = this.props
        if(onEnterKeyDown && e.key === 'Enter'){
            onEnterKeyDown()
          }
    }
    render() {
        const { title, value, placeholder, style, fieldStyle, titleStyle, containerStyle, titleContainerStyle, disabled } = this.props

        const { handleChange, _handleKeyDown } = this;
    
            return (
                <Grid xs={12} item sx={{display:'flex', width:'100%',alignItems:'flex-start',justifyContent: 'flex-start', ...containerStyle }}>
                    { (title) && <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle}}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:{xs:'16px', md:'18px', lg:'20px'}, width:'100%', ...textStyle, ...titleStyle}}>{title}</Typography>
                    </Box>
                     }
                    <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'50%', ...fieldStyle }}>
                        <FormControl
                            xs={12}
                            sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000',width:'100%', border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px', ...style }}
                        >   
                            
                            <InputBase
                                sx={{ ml: .5, mt: .5, flex: 1, color: '#000000', opacity: 1,px:1 }}
                                inputProps={{ 'aria-label': { title }, color: '#000000' }}
                                value={value || ''}
                                placeholder={ placeholder || ''}
                                onChange={ handleChange }
                                onKeyDown={ _handleKeyDown }
                                disabled={disabled}
                                fullWidth
                            />
                        </FormControl>
                    </Box>
                </Grid>
            
            );
    }
}

const textStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
}

  const mapDispatchToProps = dispatch => ({ dispatch })
  export default connect(mapDispatchToProps)(StyledTextField)