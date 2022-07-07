import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Typography, TextField, Autocomplete } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

class AddressAutoComplete extends React.PureComponent{
    state={}

    render(){ 
        const { _handleAutoCompInputChange, _handleAutoCompChange, filterOptions, sx } = this.props
        return(
            <Autocomplete
                sx={{ width: '100%', ...sx}}
                onChange={ _handleAutoCompChange }
                onInputChange={ _handleAutoCompInputChange}
                disablePortal
                id="companySearch"
                popupIcon={ <SearchIcon/> }
                options={filterOptions || []}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option
                    }
                    if (option && option?.inputValue) {
                        return option.inputValue
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
                        placeholder={ 'Search' || '' }

                    />
            }
        />)
    }
}

// Prop Types
AddressAutoComplete.propTypes = {
    dispatch: PropTypes.func,

}

AddressAutoComplete.defaultProps = {
  dispatch: () => null,
 
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddressAutoComplete)