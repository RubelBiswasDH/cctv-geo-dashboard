import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

// Import Components
import { Box, Chip, LinearProgress,Typography, Button, Grid, FormControl, Select, MenuItem, Tooltip } from '@mui/material'
import { DataGrid, GridOverlay, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid'
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

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
    render() {
        const { rows, columns, disableColumnFilter, renderActions, rowHeight, ...restProps } = this.props       
        return (
            <DataGrid
                disableSelectionOnClick
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
                                                <Button 
                                                    disabled={cellValues?.row?.deleted_reason}
                                                    onClick={cellValues.row.viewProfile}
                                                    sx={{display:'flex',justifyContent:'flex-start'}}
                                                    > 
                                                    <Typography 
                                                        sx={{
                                                            fontFamily:'Roboto',
                                                            fontSize: {xs:'10px',sm:'12px',md:'14px',lg:'16px'},
                                                            fontWeight:400,
                                                            fontStyle: 'normal',
                                                            color:'#007AFF',
                                                            textTransform:'none',
                                                            textDecoration: 'underline',
                                                            overflow:'hidden',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow:'ellipsis',
                                                            }}
                                                            >
                                                            {cellValues.value}
                                                    </Typography>
                                                </Button>
                                                : cellValues.field === 'is_late' 
                                                ? cellValues.value === 'Yes'
                                                ? <Chip color='warning' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}}/>

                                                : <Chip color='success' label={cellValues.value} sx={{textAlign:'center',fontWeight:500,color:'white'}} />
                                                :cellValues?.field === 'view_profile'
                                                ? <Button onClick={cellValues.row.viewProfile}>View</Button>
                                                :cellValues?.field === 'delete_user'
                                                ? <Button onClick={cellValues.row.deleteUser}><Typography sx={{color:'red'}}>Delete</Typography></Button>
                                                :cellValues?.field === 'update_user'
                                                ? <Button disabled={cellValues?.row?.deleted_reason} onClick={cellValues.row.updateUser}><Typography >Update</Typography></Button>

                                                :(cellValues.field === 'validation' & cellValues?.row?.is_late === "Yes")
                                                ?<CustomSelect dispatch={this.props.dispatch} onChange={cellValues?.row?.setValidation} options={[0,1]} value={cellValues?.row?.is_valid}></CustomSelect>
                                                :(cellValues.field === 'edit')
                                                ?<Button onClick={cellValues.row.editAnnouncement}>Edit</Button>
                                                :(cellValues.value === 'P')
                                                ?<Tooltip title={'Checked In : '+(cellValues?.row?.check_in_time ?? cellValues?.row[cellValues?.field+"_enter_time"])}><Chip icon={<DoneRoundedIcon />} label="On Time" variant="outlined" size="small" /></Tooltip>
                                                :(cellValues.value === 'L')
                                                ?<Tooltip title={'Checked In : '+( cellValues?.row?.check_in_time ?? cellValues?.row[cellValues?.field+"_enter_time"])}><Chip icon={<ErrorRoundedIcon />} label="Late" variant="outlined" size="small" /></Tooltip>
                                                :(cellValues.value === 'A')
                                                ?<Chip icon={<CachedRoundedIcon />} label="On Leave" variant="outlined" size="small" />
                                                :cellValues.value
                                        }                                        
                                    </Box>
                                )
                            }
                        })),                        
                    ]
                }
                disableColumnFilter={ disableColumnFilter ?? false }
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
            <GridToolbarExport/>
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