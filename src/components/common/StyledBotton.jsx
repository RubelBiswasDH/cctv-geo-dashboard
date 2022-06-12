import React from 'react'
import { Button,Typography } from '@mui/material'
import PropTypes from 'prop-types'


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
        const {onClick, style, children, sx, btnColor, ...rest} = this.props
        return (
        <Button {...rest} onClick={onClick} sx={{overflow:'auto',...btnStyle,...style}} variant="contained" color={ btnColor ?? "btnSubmit"}>
            <Typography noWrap sx={{fontSize:'.8em',fontWeight:800,p:.5,pt:.75,...sx}}>{children}</Typography>
        </Button>
    )
    }
}

StyledButton.propTypes ={
    onClick: PropTypes.func,
    style: PropTypes.object,
    children: PropTypes.string
}

StyledButton.defaultProps = {
    onClick: () => null,
    style: {},
    children: 'Text'
}

export default StyledButton;