import React from 'react'
import { Box } from '@mui/material'
import StyledAppBar from './common/StyledAppBar'

class AdminThread extends React.PureComponent{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Box sx={{width:'100%'}}>
                <StyledAppBar title={'Admin Thread'} bgColor={'#FF6961'}/>
                Admin Thread
            </Box>
        );
    }
}

export default AdminThread;