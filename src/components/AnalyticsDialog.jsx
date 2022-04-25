import React from 'react'
import PropTypes from 'prop-types'

// Impot Components
import { Box } from '@mui/material'
import StyledDialog from './common/StyledDialog'
import Analytics from './Analytics'

class AnalyticsDialog extends React.PureComponent {
    render() {
        const { isDialogOpen, handleDialogOnClose } = this.props
        return (
            <StyledDialog
                isDialogOpen={ isDialogOpen }
                title='Analytics'
                handleDialogOnClose={ handleDialogOnClose }
                maxWidth={ 'xl' }
            >
                <Box sx={ contentBodyStyles }>
                    <Analytics />
                </Box>
            </StyledDialog>
        )
    }
}

// Styles
const contentBodyStyles = {
    width: '100%',
    minHeight: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

// PropTypes
AnalyticsDialog.propTypes = {    
    handleDialogOnClose: PropTypes.func,
    isDialogOpen: PropTypes.bool,    
}
  
  AnalyticsDialog.defaultProps = {
    handleDialogOnClose: () => null,
    isDialogOpen: false,    
}

export default AnalyticsDialog