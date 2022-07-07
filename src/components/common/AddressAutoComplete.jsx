import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setCompanyAddress, setCompanyLongitude, setCompanyLatitude } from '../../redux/reducers/registerReducer'
import { setCompanySettings, setCompanyAddressData, setFallbackComapanyAddress } from '../../redux/reducers/adminReducer'
import { getCompanyList } from '../../redux/actions/registerActions'
import { Grid, Typography, TextField, Autocomplete } from '@mui/material'


class AddressAutoComplete extends React.PureComponent{
    state={
        inputAddress:''
    }
    // handleAutoCompInputChange
    _handleAutoCompInputChange = e => {
        const { dispatch } = this.props
        dispatch(setFallbackComapanyAddress(e.target.value))
        dispatch(getCompanyList(e.target.value))
    }

    // handleAutoCompChange
    _handleAutoCompChange = (e, value) => {
        const { dispatch, companySettings } = this.props
        dispatch(setFallbackComapanyAddress(''))
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
        const { companyNameOptions, companySettings, sx } = this.props
        const { inputAddress } = this.state
        return(
            <Autocomplete
                clearOnBlur={true}
                sx={{ width: '100%', ...sx}}
                onChange={ _handleAutoCompChange }
                onInputChange={ _handleAutoCompInputChange}
                disablePortal
                id="companySearch"
                options={ companyNameOptions ?? [] }
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
                        <Grid item xs={12}><Typography sx={{ fontSize: '1em' }}>{option?.Address}</Typography></Grid>
                        <Grid item xs={12}><Typography>{`${option?.Address+', '}${option?.area+', '}${option?.district}`}</Typography></Grid>
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
                        placeholder={ companySettings?.companyAddressData?.exact_address || '' }

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