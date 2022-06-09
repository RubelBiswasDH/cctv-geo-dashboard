import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

// Import Components
import { Box, Chip, LinearProgress,Typography, Button, Grid, FormControl, Select, MenuItem  } from '@mui/material'
import { DataGrid, GridOverlay, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid'


const CustomSelect = (props) => {
    const handleChange = (e) => {
        props.dispatch(props.onChange)
    }
    const {value, options, style, xs } = props
    return (
        <Grid item xs = {xs} sx={{p:0,m:0, ...style}} >
            <FormControl sx={{m: 0, p:0, width: '100%',height:'100%',fontFamily:'Roboto', fontWeight:500}} size="small">
                <Select
                    labelId="select-small"
                    id="select-small"
                    value={value}
                    onChange={handleChange}
                    sx={{width:'100%', background:'#8BC6FC',border:'none',m:0,p:0,pt:.5,borderRadius:2,height:'100%',fontSize:'.7em'}}
                >
                    {options.map((option) => (
                        <MenuItem 
                            key={option} sx={{fontSize:'.7em'}} value={option}>{(option===1)?'Valid':"Invalid"}
                        </MenuItem>))}
                </Select>
            </FormControl>
        </Grid>
    );
}

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
                                                <Typography sx={{fontSize:'1.5em',fontWeight:500}}>{cellValues.value}</Typography>
                                                : cellValues.field === 'is_late' 
                                                ? cellValues.value === 'Yes'
                                                ? <Chip color='warning' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}}/>

                                                : <Chip color='success' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}} />
                                                :cellValues?.field === 'view_profile'
                                                ? <Button onClick={cellValues.row.viewProfile}>View</Button>
                                                :(cellValues.field === 'validation' & cellValues?.row?.is_late === "Yes")
                                                ?<CustomSelect dispatch={this.props.dispatch} onChange={cellValues?.row?.setValidation} options={[0,1]} value={cellValues?.row?.is_valid}></CustomSelect>
                                                :(cellValues.field === 'edit')
                                                ?<Button onClick={cellValues.row.editAnnouncement}>Edit</Button>
                                                :(cellValues.value === 'P')
                                                ?<Chip color='darkGreen' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}} />
                                                :(cellValues.value === 'L')
                                                ?<Chip color='liteGreen' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'black'}} />
                                                :(cellValues.value === 'A')
                                                ?<Chip color='error' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}} />
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

// export default StyledDataGrid
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapDispatchToProps)(StyledDataGrid)