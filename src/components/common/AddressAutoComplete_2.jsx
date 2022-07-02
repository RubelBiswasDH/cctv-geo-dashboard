import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Box, Grid, Typography, TextField, Autocomplete } from '@mui/material'


class AddressAutoComplete extends React.PureComponent{
    state={}

    render(){ 
        const { _handleAutoCompInputChange, _handleAutoCompChange, filterOptions, title, titleStyle, value, titleContainerStyle, fieldStyle, sx } = this.props
        return(
            <Box sx={{display:'flex', width:'100%', ...sx}}>
                { title && <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle}}>
                    <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...titleStyle }}>{title}</Typography>
                </Box>
                }
                <Autocomplete
                    sx={{ width: '100%', ...fieldStyle }}
                    onChange={ _handleAutoCompChange }
                    onInputChange={ _handleAutoCompInputChange }
                    disablePortal
                    id="companySearch"
                    options={filterOptions || []}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option && option?.inputValue) {
                            return option.inputValue;
                        }
                        return option.Address
                    }}
                    renderOption={(props, option) => (
                        <Grid container {...props} key={option.id} >
                            <Grid item xs={12}><Typography sx={{ fontSize: '1em' }}>{option?.Address?.split(',')[0]}</Typography></Grid>
                            <Grid item xs={12}><Typography>{option?.Address}</Typography></Grid>
                        </Grid>)}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            variant='outlined'
                            margin='none'
                            size='small'
                            fullWidth={true}
                            name='address'
                            type='text'
                            placeholder={ value || '' }

                        />
                }
            />
        </Box>)
    }
}

// Prop Types
AddressAutoComplete.propTypes = {
    dispatch: PropTypes.func,
    _handleAutoCompInputChange: PropTypes.func,
    _handleAutoCompChange: PropTypes.func,
    filterOptions: PropTypes.array,
    title: PropTypes.string,
    value: PropTypes.any,
    sx: PropTypes.object
}

AddressAutoComplete.defaultProps = {
  dispatch: () => null,
  _handleAutoCompInputChange: () => null,
  _handleAutoCompChange: () => null,
  filterOptions: [],
  title: '',
  value: null,
  sx: null
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddressAutoComplete)