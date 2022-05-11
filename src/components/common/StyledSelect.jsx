import * as React from 'react';
import {connect} from 'react-redux'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
        const {value, options} = this.props
        // console.log("optons: ",options)
        return (
            <FormControl sx={{ m: 0, p:0, minWidth: 120,height:'100%',fontFamily:'Roboto', fontWeight:500}} size="small">
                {/* <InputLabel id="demo-select-small">isActive</InputLabel> */}
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={value}
                
                    // label="Age"
                    onChange={handleChange}
                    sx={{background:'#8BC6FC',border:'none',m:0,p:0,pt:.5,borderRadius:2,height:'100%',fontSize:'.7em'}}
                >
                    {/* <MenuItem value="">
                        <em>None</em>
                    </MenuItem> */}
                    {options.map((option) => (<MenuItem key={option} sx={{fontSize:'.7em'}} value={option}>{option.replace('_',' ').toUpperCase()}</MenuItem>))}
                    {/* <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"non_active"}>Non Active</MenuItem> */}

                    {/* <MenuItem value={"other"}>Thirty</MenuItem> */}
                </Select>
            </FormControl>
        );
    }
}

// export default StyledSelect;
const mapDispatchToProps = dispatch => ({ dispatch })
  
export default connect(mapDispatchToProps)(StyledSelect)