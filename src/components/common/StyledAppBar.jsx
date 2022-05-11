import React from 'react'
import { AppBar, Typography } from '@mui/material'


class StyledAppBar extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const {title,bgColor} = this.props;
        return (
            <AppBar
                position='sticky'
                sx={theme => ({

                    padding: theme.spacing(1),
                    // background: theme.palette.gray[200],
                    background: bgColor,
                    boxShadow: theme.shadows[2],
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                })}
            >
                {/* <Tooltip title='Collapse'>
                    <IconButton
                        onClick={this._closeTaskThread}
                        sx={{ padding: 0 }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Tooltip> */}

                <Typography
                    variant='h6'
                    align='center'
                    sx={theme => ({
                        width: '100%',
                        color: theme.palette.text.white,
                        fontSize: '14px',
                        fontWeight: 600,

                    })}
                >
                    {title}
                </Typography>
            </AppBar>
        );
    }
}


export default StyledAppBar;