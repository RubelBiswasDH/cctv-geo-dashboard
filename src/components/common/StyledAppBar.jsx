import React from 'react'
import PropTypes from 'prop-types'
import { AppBar, Typography } from '@mui/material'


class StyledAppBar extends React.PureComponent {
    render() {
        const {title, bgColor, style} = this.props;
        return (
            <AppBar
                position='relative'
                sx={theme => ({

                    padding: theme.spacing(1),
                    background: bgColor,
                    boxShadow: theme.shadows[2],
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...style
                  
                })}
            >

                <Typography
                    variant='h6'
                    
                    sx={theme => ({
                        width: '100%',
                        color: theme.palette.text.white,
                        fontSize: '14px',
                        fontWeight: 600,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p:0,
                        pt:.5,
                    })}
                >
                    {title}
                </Typography>
            </AppBar>
        );
    }
}

// prop types
StyledAppBar.propTypes = {
    title: PropTypes.string,
    bgColor: PropTypes.string,
    style: PropTypes.object
}

StyledAppBar.defaultProps = {
    title: 'Title',
    bgColor: 'unset',
    style: {}
}

export default StyledAppBar;