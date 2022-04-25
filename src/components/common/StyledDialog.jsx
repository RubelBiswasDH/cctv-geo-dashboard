import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

class StyledDialog extends React.PureComponent {
    render() {
        const { isDialogOpen, handleDialogOnClose, title, footer, children, ...restProps } = this.props
        return (
            <Dialog
                open={ isDialogOpen }
                onClose={ handleDialogOnClose }
                fullWidth={ true }
                fullScreen={ window.innerWidth < 768 ? true : false }
                scroll={ 'paper' }
                { ...restProps }
            >
                <DialogTitle >
                    <Box sx={ center }>
                        <Typography sx={ titleHeaderTextStyles }>
                            { title }
                        </Typography>
                        <IconButton
                            sx={ closeIconStyles }
                            onClick={ handleDialogOnClose }
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                
                <DialogContent dividers={ true }>
                    { children }                
                </DialogContent>

                { footer &&
                    <DialogActions>
                        { footer }
                    </DialogActions>
                }
            </Dialog>
        )
    }
}

// JSS Styles
const closeIconStyles = {
    position: 'absolute',
    right: 10,
    top: 8
}

const titleHeaderTextStyles = {
    textDecoration: 'underline',
    fontSize: '20px',
    fontWeight: 600
}

const center = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

// PropTypes
StyledDialog.propTypes = {    
    handleDialogOnClose: PropTypes.func,
    isDialogOpen: PropTypes.bool,
    title: PropTypes.string,
    footer: PropTypes.node
}

StyledDialog.defaultProps = {
    handleDialogOnClose: () => null,
    isDialogOpen: false,
    title: 'Title',
    footer: null,
}

export default StyledDialog