import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import dayjs from 'dayjs'
//import components
import { TextField, Box, Typography }  from '@mui/material'

class StyledDatePicker extends React.PureComponent{
    _handleDateChange = date => {
        const { dispatch, action, subField, field, value } = this.props
        const selected_date = date?.$d && (dayjs(new Date(date?.$d)).format('YYYY-MM-DD') || value || '')
        if (subField && subField?.length) {
            dispatch(action({
                [ subField ]: selected_date
            }))
        }
        else if(field && field?.length) {
            dispatch(action({ [field]: selected_date }))
        }
        else{
            dispatch(action(selected_date))
        }
    }
    render(){
        const { sx, fieldStyle, title, titleStyle, titleContainerStyle, value, disabled  } = this.props
        return <Box sx={{display:'flex', width:'100%', ...sx}}>
                { title && 
                    <Box sx={{display:'flex',alignItems:'center',justifyContent: 'flex-start',width:'15%', ...titleContainerStyle }}>
                        <Typography variant='h6' sx={{ fontWeight:600, fontSize:'20px', ...titleStyle}}>{title}</Typography>
                    </Box>
                }
                <LocalizationProvider dateAdapter={ AdapterDayjs }>
                    <DatePicker
                        disabled={disabled}
                        value = { value }
                        onChange={ this._handleDateChange }
                        disableMaskedInput={ true }
                        inputFormat={ 'DD-MM-YYYY' }
                        renderInput={(params) => (                                            
                            <Box sx={{ display: 'flex', alignItems: 'center', width:'100%', ...fieldStyle }}>
                                <TextField {...params} size={ 'small' } fullWidth={ true } />
                            </Box>                                            
                        
                        )}
                        PopperProps={{
                        placement: 'bottom-start',
                        }}
                        onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
                    />
                </LocalizationProvider>
            </Box>
    }
}

export default StyledDatePicker