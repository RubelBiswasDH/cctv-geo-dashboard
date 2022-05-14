import React from 'react'
import { Button } from '@mui/material'


// Roboto
// Weight 500, Medium
// Size 18px
// Line height 21.09px
class StyledButton extends React.PureComponent{
    constructor(props){
        super(props)
        this.state = {
            btnStyle: {
                textTransform:'none',
                fontFamily: 'Roboto',
                fontWeight:500,
                borderRadius: '1em',
            }
        }
    }

    render(){
        const {btnStyle} = this.state;
        const {onClick,style,children} = this.props
        return (
        <Button onClick={onClick} sx={{overflow:'auto',...btnStyle,...style}} variant="contained" color="btnGreen">{children}</Button>
    )
    }
}

export default StyledButton;