import React from 'react'
import { connect } from 'react-redux'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

class StyledInputField extends React.PureComponent {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange = (e) => {
        e.preventDefault()
        //console.log("input value: ",e.target.value)
        this.props.dispatch(this.props.onChange(e.target.value))
        //console.log(`changed ${e.target.value}`)
    
    }
    render() {
        const {placeholder, ariaLabel, style, value, onChange} = this.props;
        const {handleChange} = this;
        return (
            <Paper
                xs={12}
                sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#887A7A', color: 'white', ...style }}
            >
                <InputBase
                    sx={{ ml: 3, mt: .5, flex: 1, color: 'white', opacity: 1 }}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': {ariaLabel}, color: 'white' }}
                    value={value}
                    onChange={handleChange}
                />
                {/* <IconButton sx={{ p: '10px' }} aria-label={ariaLabel}>
                    <SearchIcon sx={{ color: 'white' }} />
                </IconButton> */}
            </Paper>
            );
    }
}

// export default StyledInputField;

  const mapDispatchToProps = dispatch => ({ dispatch })
  export default connect(mapDispatchToProps)(StyledInputField)