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
        this.props.dispatch(this.props.onChange(e.target.value))
    }
    render() {
        const {placeholder, ariaLabel, style, field, value, onChange, inputStyle, dispatch, ...rest} = this.props;
        const {handleChange} = this;
        return (
            <Paper
                xs={12}
                sx={{ p: '0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#000000', border:'1px solid #000000', ...style }}
            >
                <InputBase
                    {...rest}
                    sx={{ ml: 3, mt: .5, flex: 1, color: '#000000', opacity: 1, ...inputStyle }}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': {ariaLabel}, color: '#000000' }}
                    value={value}
                    onChange={handleChange}
                />
            </Paper>
            );
    }
}


  const mapDispatchToProps = dispatch => ({ dispatch })
  export default connect(mapDispatchToProps)(StyledInputField)