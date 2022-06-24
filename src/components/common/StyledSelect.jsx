import * as React from 'react';
import {connect} from 'react-redux'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Grid} from '@mui/material'

class StyledSelect extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange = (event) => {
        this.props.dispatch(this.props.onChange(event.target.value));
    };

    render() {
        const {handleChange} = this
        const {value, options, style, xs} = this.props
        return (
            <Grid item xs = {xs} sx={{p:0,m:0, ...style}} >
                <FormControl sx={{m: 0, p:0, width: '100%',height:'100%',fontFamily:'Roboto', fontWeight:500}} size="small">
                    <Select
                        labelId="select-small"
                        id="select-small"
                        value={value}
                   
                        // label="Age"
                        onChange={handleChange}
                        sx={{width:'100%', background:'#8BC6FC',border:'none',m:0,p:0,pt:.5,borderRadius:2,height:'100%',fontSize:'.7em'}}
                    >
                        {options.map((option) => (<MenuItem key={option} sx={{fontSize:'.7em'}} value={option}>{option.replaceAll('_',' ').toUpperCase()}</MenuItem>))}
                    </Select>
                </FormControl>
            </Grid>
        );
    }
}

// export default StyledSelect;
const mapDispatchToProps = dispatch => ({ dispatch })
  
export default connect(mapDispatchToProps)(StyledSelect)