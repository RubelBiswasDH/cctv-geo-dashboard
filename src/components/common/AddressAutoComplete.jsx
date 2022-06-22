import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setCompanyAddress, setCompanyLongitude, setCompanyLatitude } from '../../redux/reducers/registerReducer'
import { setCompanySettings, setCompanyAddressData } from '../../redux/reducers/adminReducer'
import { getCompanyList } from '../../redux/actions/registerActions'
import { Box, Grid, Typography, TextField, Autocomplete } from '@mui/material'


class AddressAutoComplete extends React.PureComponent{
    state={}
    // handleAutoCompInputChange
    _handleAutoCompInputChange = e => {
        const { dispatch } = this.props
        dispatch(getCompanyList(e.target.value))
    }

    // handleAutoCompChange
    _handleAutoCompChange = (e, value) => {
        const { dispatch, companySettings } = this.props
        dispatch(setCompanyAddress(value?.Address ?? ''))
        dispatch(setCompanyAddressData(value?.Address ? {
            exact_address: value?.Address,
            longitude: value?.longitude,
            latitude: value?.latitude,
        } : {}))
        const newAddress = value?.Address ? {
            exact_address: value?.Address,
            longitude: value?.longitude,
            latitude: value?.latitude,
        } : {}
        dispatch(setCompanySettings({ ...companySettings, ...{ companyAddressData: newAddress } }))
        dispatch(setCompanyLongitude(value?.longitude ?? ''))
        dispatch(setCompanyLatitude(value?.latitude ?? ''))
    }

    render(){ 
        const { _handleAutoCompInputChange, _handleAutoCompChange } = this
        const { companyNameOptions, sx } = this.props
        return(
            <Autocomplete
                sx={{ width: '100%', ...sx}}
                onChange={ _handleAutoCompChange }
                onInputChange={ _handleAutoCompInputChange}
                disablePortal
                id="companySearch"
                options={companyNameOptions || []}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.Address
                }}
                renderOption={(props, option) => (
                    <Grid container {...props} key={option.id} >
                        <Grid item xs={12}><Typography sx={{ fontSize: '1em' }}>{option.Address.split(',')[0]}</Typography></Grid>
                        <Grid item xs={12}><Typography>{option.Address}</Typography></Grid>
                    </Grid>)}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        variant='outlined'
                        margin='none'
                        size='small'
                        fullWidth={true}
                        name='companyAddress'
                        type='text'
                        placeholder=''

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
    companySettings: state?.admin?.companySettings,
    companyNameOptions: state?.register?.companyNameOptions,
    companyLatitude: state?.register?.companyLatitude,
    companyLongitude: state?.register?.companyLongitude,
    companyAddressData: state?.admin?.companyAddressData,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(AddressAutoComplete)