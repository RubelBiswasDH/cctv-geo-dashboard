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
                fontSize:'10px',
                fontSize: '.8em',
                px:'10px',
                borderRadius: '25px',
                minWidth: '12vw',
            }
        }
    }

    render(){
        const {btnStyle} = this.state;
        const {onClick,style,children} = this.props
        return (
        <Button onClick={onClick} sx={{...btnStyle,...style}} variant="contained" color="btnGreen">{children}</Button>
    )
    }
}

export default StyledButton;