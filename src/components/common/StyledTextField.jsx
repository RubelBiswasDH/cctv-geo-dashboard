import React from 'react'
import { connect } from 'react-redux'
import { Grid, Box, Typography, Paper, InputBase } from '@mui/material';

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
        else {
            dispatch(action({ [field]: e.target.value }))
        }
    }

    render() {
        const { title, value, field, subField, style, fieldStyle, titleStyle, containerStyle, labelContainerStyle } = this.props

        const { handleChange } = this;
    
            return (
                <Grid xs={12} item sx={{display:'flex',gap:2, width:'100%',alignItems:'flex-start',justifyContent: 'flex-start', ...containerStyle }}>
                    { (title) && <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...labelContainerStyle}}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px',width:'100%', ...textStyle}}>{title}</Typography>
                    </Box>
                     }
                    <Box  sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'50%', ...fieldStyle }}>
                        <Paper
                            xs={12}
                            sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000',width:'100%', border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px', ...style }}
                        >   
                            
                            <InputBase
                                sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1 }}
                                inputProps={{ 'aria-label': { title }, color: '#000000' }}
                                value={value || ''}
                                onChange={ handleChange }
                            />
                        </Paper>
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