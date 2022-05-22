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
        const {onClick,style,children,sx} = this.props
        // console.log('sx: ',sx)
        return (
        <Button onClick={onClick} sx={{overflow:'auto',...btnStyle,...style}} variant="contained" color="btnSubmit">
            <Typography sx={{fontSize:'.8em',fontWeight:800,p:.5,pt:.75,...sx}}>{children}</Typography>
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