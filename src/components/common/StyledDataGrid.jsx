import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Box, Chip, LinearProgress,Typography } from '@mui/material'
import { Refresh } from '@mui/icons-material'
import { DataGrid, GridOverlay, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid'

class StyledDataGrid extends React.PureComponent {
    // Handle Status Color
    _getStatusColor = status => {
        let colors = { color: '#FFF' }
        if (status) {
            switch(status) {
                case 'OPEN':
                    colors = {...colors, background: '#99A799', }
                    break;

                case 'DISPATCHED':
                    colors = {...colors, background: '#54A0FF'}
                    break;

                case 'ASSIGNED':
                    colors = {...colors, background: '#9B59B6'}
                    break;

                case 'ONGOING':
                    colors = {...colors, background: '#2133A1'}
                    break;

                case 'PRECOMPLETION':
                    colors = {...colors, background: '#F75C1E'}
                    break;

                case 'RESOLVED':
                    colors = {...colors, background: '#43BC5D'}
                    break;
                    
                case 'CLOSED':
                    colors = {...colors, background: '#064635'}
                    break;
                
                case 'CANCELLED':
                    colors = {...colors, background: '#FF1818'}
                    break;

                default:
                    colors = { ...colors, color: '#000000' }
            }
        }
        
        return colors
    }

    render() {
        const { rows, columns, renderActions, rowHeight, ...restProps } = this.props        
        return (
            <DataGrid
                rows={ rows }
                getRowClassName={rowValues =>
                    `${ rowValues.row?.is_emergency ? 'row-emergency' : '' }`
                }
                columns={
                    [
                        // {
                        //     field: 'actions',
                        //     type: 'actions',
                        //     headerName: 'Actions',
                        //     minWidth: 100,
                        //     maxWidth: 600,
                        //     getActions: renderActions
                        // },
                        ...columns.map(c => ({
                            ...c,
                            renderCell: cellValues => {                                
                                return (
                                    <Box
                                        sx={{
                                            maxHeight: 'inherit',
                                            width: '100%',
                                            whiteSpace: 'initial'
                                        }}
                                    >
                                        {
                                            cellValues.field === 'name' ?
                                                // <Chip
                                                //     icon={ cellValues?.row?.reopen && <Refresh sx={{ color: '#ffffff !important' }} /> }
                                                //     sx={ this._getStatusColor(cellValues.value) }
                                                //     label={ 
                                                //         cellValues.value === 'PRECOMPLETION' ?
                                                //         `TASK CLOSED${ cellValues?.row?.reopen ? ` (${ cellValues?.row?.reopen })` : '' }`
                                                //         :
                                                //         `${ cellValues.value }${ cellValues?.row?.reopen ? ` (${ cellValues?.row?.reopen })` : '' }`
                                                //     }
                                                //     size={ 'small' }
                                                // />
                                                <Typography sx={{fontSize:'1.5em',fontWeight:500}}>{cellValues.value}</Typography>
                                                : cellValues.field === 'is_late' 
                                                ? cellValues.value === 'Yes'
                                                ? <Chip color='warning' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}}/>

                                                : <Chip color='success' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}} />
                                                :cellValues.value
                                        }                                        
                                    </Box>
                                )
                            }
                        })),                        
                    ]
                }
                disableColumnFilter={ false }
                hideFooterPagination={ true }
                hideFooterSelectedRowCount={ true }
                disableColumnMenu={ false }
                disableColumnSelector
                hideFooter={ true }  
                sx={ dataGridStyles }
                density='compact'
                components={{
                    LoadingOverlay: LinearProgressFactory,
                    Toolbar: CustomToolbar
                }}
                { ...restProps }
            />
        )
    }
}

// Custom Toolbar
const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    )
}


// Styled Components
const LinearProgressFactory = () => (
    <GridOverlay>
        <LinearProgress
            sx={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '4px'
            }}
        />
    </GridOverlay>
)

// JSS Styles
const dataGridStyles = theme => ({    
    '& .MuiDataGrid-columnHeaders': {
        // background: theme.palette.grey[200],
        background: theme.palette.tableHeader.main,
        boxShadow: theme.shadows[2]
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 600,
        color: theme.palette.text.primary
    },
    '& .row-emergency.MuiDataGrid-row': {
        background: 'rgba(211, 47, 47, 0.2)'
    },
    '& .row-emergency.MuiDataGrid-row:hover': {
        background: 'rgba(211, 47, 47, 0.3)'
    },
    '& row-emergency.MuiDataGrid-row.Mui-selected': {
        background: 'rgba(211, 47, 47, 0.2)'
    }
})

// PropTypes
StyledDataGrid.propTypes = {    
    rows: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),    
    renderActions: PropTypes.func
}

StyledDataGrid.defaultProps = {
    rows: [{}],
    columns: [{}],
    renderActions: () => [],
}

export default StyledDataGrid