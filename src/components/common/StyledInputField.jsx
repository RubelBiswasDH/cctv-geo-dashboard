import React from 'react'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

class StyledInputField extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render() {
        const {placeholder, ariaLabel, style} = this.props;

        return (
            <Paper
                sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12vw', backgroundColor: '#5F5F5F', color: 'white', px: '10px', ...style }}
            >
                <InputBase
                    sx={{ ml: 3, mt: .5, flex: 1, color: 'white', opacity: 1 }}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': {ariaLabel}, color: 'white' }}
                />
                {/* <IconButton sx={{ p: '10px' }} aria-label={ariaLabel}>
                    <SearchIcon sx={{ color: 'white' }} />
                </IconButton> */}
            </Paper>
            );
    }
}

export default StyledInputField;