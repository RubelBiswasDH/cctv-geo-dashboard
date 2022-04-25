import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _isEqual from 'fast-deep-equal'

// Import Components
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, InputLabel, MenuItem, TextField, Typography, Box, IconButton, RadioGroup, Radio, FormControlLabel, Snackbar, Alert, Chip, Divider, Link } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Close, Refresh } from '@mui/icons-material'
import MapGL from '../components/common/MapGL'

// Import Actions & Methods
import { updateTask } from '../redux/actions/taskActions'

// Import Types
import { BASE_URL } from '../App.config'

class TaskDetailsDialog extends React.PureComponent {
    state = {
        data: {},
        isUpdateLoading: false,
        isDispatchLoading: false,
        isFlagEmergencyLoading: false,
        isReopenLoading: false,
        isCancelledLoading: false,
        remarks: '',
        feedback: null,
        disabled: false
    }

    componentDidMount = () => {
        const { data } = this.props
        if (data) {
            this.setState({ data })
        }
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props

        // If Data Changes In Props
        if(!_isEqual(prevProps.data, data)) {
            if (data) {
                this.setState({ data })
            }
        }
    }

    // Hanlde onChange
    _onChange = e => {
        const { sndList } = this.props
        const { data } = this.state

        const name = e.target.name
        const value = e.target.value
        if (name) {
            this.setState({
                data: {
                    ...data,
                    [ name ]: value,
                    snd_id: name === 'snd' ?
                        sndList.find(s => s?.value === value)?.snd?.id ?? data.snd_id
                        :
                        data.snd_id
                }
            })
        }
    }

    // Handle Remarks Change
    _onRemarksChange = e => {
        this.setState({ [ e.target.name ]: e.target.value })
    }

    // Handle Update
    _handleUpdateChange = () => {
        const { data, remarks } = this.state        

        // Set Is Update Loading
        this.setState({ isUpdateLoading: true })

        // Update Task Payload
        const updatedPayload = {
            ...data,
            complaint_details: data.remarks,
            remarks
        }

        // Dispatch To SND
        updateTask(data.id, updatedPayload)
            .then(feedback => {
                this.setState({ feedback, isUpdateLoading: false })
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isUpdateLoading: false })
            })
    }

    // Handle Dispatch
    _handleDispatch = () => {
        const { data, remarks } = this.state

        // Set Is Dispatch Loading
        this.setState({ isDispatchLoading: true })

        // Dispatch To SND
        updateTask(data.id, { ...data, status: 'DISPATCHED', remarks })
            .then(feedback => {
                this.setState({ feedback, isDispatchLoading: false })

                // Close Dialog
                this._onClose()
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isDispatchLoading: false })
            })
    }

    // Handle Task Close
    _handleTaskClose = () => {
        const { data, remarks } = this.state

        // Set Is Dispatch Loading
        this.setState({ isDispatchLoading: true })

        // Close Task
        updateTask(data.id, { status: 'CLOSED', is_emergency: 0, remarks })
            .then(feedback => {
                this.setState({ feedback, isDispatchLoading: false })

                // Close Dialog
                this._onClose()
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isDispatchLoading: false })
            })
    }

    // Handle Task Re-open
    _handleTaskReopen = () => {
        const { data, remarks } = this.state

        // Set Is Reopen Loading
        this.setState({ isReopenLoading: true })

        // Close Task
        updateTask(data.id, { ...data, status: 'REOPEN', remarks })
            .then(feedback => {
                this.setState({ feedback, isReopenLoading: false })

                // Close Dialog
                this._onClose()
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isReopenLoading: false })
            })
    }

    // Handle Task Flag Emergency
    _handleFlagEmergency = () => {
        const { data, remarks } = this.state

        // Set Is Flag Emergency Loading
        this.setState({ isFlagEmergencyLoading: true })

        // Task Flag Emergency
        updateTask(
            data.id,
            { status: data.status, is_emergency: 1, remarks }
        )
            .then(feedback => {
                this.setState({
                    feedback,
                    isFlagEmergencyLoading: false,
                    data: {
                        ...data,
                        is_emergency: 1
                    }
                })
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isFlagEmergencyLoading: false })
            })
    }

    // Handle Task Cancelled
    _handleTaskCancelled = () => {
        const { data, remarks } = this.state

        // Set Is Cancel Loading
        this.setState({ isCancelledLoading: true })

        updateTask(data.id, { ...data, status: 'CANCELLED', remarks })
            .then(feedback => {
                this.setState({ feedback, isCancelledLoading: false })

                // Close Dialog
                this._onClose()
            })
            .catch(err => {
                console.error(err)
                this.setState({ feedback: null, isCancelledLoading: false })
            })
    }

    // On Feedback Close
    _onFeedbackClose = () => {
        this.setState({ feedback: null })
    }

    // On Close
    _onClose = (e, reason) => {
        const { handleDialogOnClose } = this.props
        if (reason && reason === 'backdropClick') {
            return
        } else {
            this.setState({
                data: {},
                isUpdateLoading: false,
                isDispatchLoading: false,
                isFlagEmergencyLoading: false,
                remarks: '',
                feedback: null
            })
            handleDialogOnClose()
        }
    }

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

    // Updated exact address from reverse geocoding
    _updateExactAddress = (updatedAddress) => {
        const { data } = this.state        

        const updatedDate = {
            ...data,
            exact_address: updatedAddress.exact_address,
            latitude: updatedAddress.latitude,
            longitude: updatedAddress.longitude
        }

        this.setState({ data: updatedDate })        
    }

    render() {
        const { isDialogOpen, sndList, user, queryCategory, ...restProps } = this.props
        const { data, isUpdateLoading, isDispatchLoading, isFlagEmergencyLoading, isReopenLoading, isCancelledLoading, remarks, feedback } = this.state
                
        return (
            <React.Fragment>
                <Dialog
                    open={ isDialogOpen }
                    onClose={ this._onClose }
                    fullWidth={ true }
                    fullScreen={ window.innerWidth < 768 ? true : false }
                    scroll={ 'paper' }
                    maxWidth='lg'
                    { ...restProps }
                >
                    <DialogTitle sx={theme => ({ padding: theme.spacing(1) })}>
                        <Box sx={ center }>
                            <Box sx={{ ...center, flexDirection: 'column' }}>
                                <Box sx={{ ...statusStyles, display: { xs: 'none', md: 'block' } }}>
                                    <Chip
                                        icon={ data?.reopen && <Refresh sx={{ color: '#ffffff !important' }} /> }
                                        sx={ this._getStatusColor(data?.status ?? '') }
                                        label={ 
                                            data.status === 'PRECOMPLETION' ?
                                            `TASK CLOSED${ data?.reopen ? ` (${ data?.reopen })` : '' }`
                                            :
                                            `${ data?.status }${ data?.reopen ? ` (${ data?.reopen })` : '' }`
                                        }
                                        size={ 'small' }
                                    />
                                    {
                                        (data?.is_emergency === 1) &&
                                        <Chip
                                            sx={{ background: '#ef5350', ml: '4px', color: '#FFF' }}
                                            label={ 'EMERGENCY' }
                                            size={ 'small' }                                        
                                        />
                                    }
                                </Box>                                
                                <Typography sx={ titleHeaderTextStyles }>
                                    { `Ticket Information` }
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '12px' }}>
                                        { `Customer ID: ${data?.caller_id ?? 'N/A'}` }                             
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', ml: '0.5rem' }}>
                                        { `Ticket ID: ${data.ticket_number ? data.ticket_number : 'N/A'}` }
                                    </Typography>
                                </Box>
                                <Box sx={{ display: { sm: 'block', md: 'none' } }}>
                                    <Chip
                                        icon={ data?.reopen && <Refresh sx={{ color: '#ffffff !important' }} /> }
                                        sx={ this._getStatusColor(data?.status ?? '') }
                                        label={ 
                                            data.status === 'PRECOMPLETION' ?
                                            `TASK CLOSED${ data?.reopen ? ` (${ data?.reopen })` : '' }`
                                            :
                                            `${ data?.status }${ data?.reopen ? ` (${ data?.reopen })` : '' }`
                                        }
                                        size={ 'small' }
                                    />
                                    {
                                        (data?.is_emergency === 1) &&
                                        <Chip
                                            sx={{ background: '#ef5350', ml: '4px', color: '#FFF' }}
                                            label={ 'EMERGENCY' }
                                            size={ 'small' }                                        
                                        />
                                    }
                                </Box>
                            </Box>
                            <IconButton
                                sx={ closeIconStyles }
                                onClick={ this._onClose }
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers={ true }>
                        <Grid container={ true } spacing={ 2 }>
                            <Grid item={ true } xs={ 12 } sm={ 6 }>
                                <Paper
                                    variant='outlined'
                                    sx={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <MapGL
                                        markerData={ Object.keys(data).length ? [ data ] : []}
                                        getUpdatedAddress={ this._updateExactAddress }
                                    />
                                </Paper>
                            </Grid>
                            <Grid item={ true } xs={ 12 } sm={ 6 }>
                                <Paper
                                    variant='outlined'
                                    sx={theme => ({
                                        padding: theme.spacing(4),
                                        width: '100%'
                                    })}
                                >
                                    <Grid container={ true } spacing={ 2 }>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{'Calling Number'}</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'caller_contact' }
                                                type={ 'text' }
                                                value={data && data.caller_contact ? data.caller_contact : ''}
                                                onChange={this._onChange}
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{ 'Complainer Name' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'caller_name' }
                                                type={ 'text' }
                                                value={ data && data.caller_name ? data.caller_name : '' }
                                                onChange={ this._onChange }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 12 } sm={ 12 }>
                                            <InputLabel>{ 'Complain Address' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'exact_address' }
                                                type={ 'text' }
                                                value={ data && data.exact_address ? data.exact_address : '' }
                                                onChange={ this._onChange }
                                                multiline={ true }
                                                maxRows={ 3 }
                                                disabled={ true }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{ 'Nearby Points' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'nearby_points' }
                                                type={ 'text' }
                                                value={ data && data.nearby_points ? data.nearby_points : '' }
                                                onChange={ this._onChange }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{ 'Landmarks' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'landmarks' }
                                                type={ 'text' }
                                                value={ data && data.landmarks ? data.landmarks : '' }
                                                onChange={ this._onChange }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{ 'Complaint' }</InputLabel>                                            
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'query_category' }
                                                value={ data.query_category }
                                                onChange={ this._onChange }
                                                select={ true }
                                            >
                                                { ( !queryCategory || queryCategory.length === 0 ) &&
                                                    <MenuItem dense={ true } value=''><em>{ 'None' }</em></MenuItem>
                                                }
                                                
                                                { queryCategory?.length > 0 && queryCategory.map((item, index) =>
                                                        <MenuItem
                                                            key={ index }
                                                            dense={ true }
                                                            value={ item.category ? item.category : item }
                                                        >
                                                            { item.category ? item.category : item }
                                                        </MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item={ true } xs={ 6 } sm={ 6 }>
                                            <InputLabel>{'Assigned By'}</InputLabel>
                                            <TextField
                                                disabled={ true }
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'assigned_by' }
                                                type={ 'text' }
                                                value={ data && data.assigned_by ? data.assigned_by : '' }
                                                onChange={ this._onChange }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 12 } sm={ 12 }>
                                            <InputLabel>{ 'Complaint Code' }</InputLabel>                                            
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'query_sub_category' }
                                                value={ data.query_sub_category }
                                                onChange={ this._onChange }
                                                select={ true }
                                            >
                                                { ( !data.query_category || !queryCategory || queryCategory.length === 0 || !queryCategory.find( item => item.category === data.query_category)?.subCategories ) &&
                                                    <MenuItem dense={ true } value=''><em>{ 'None' }</em></MenuItem>
                                                }
                                                                                                
                                                {
                                                    data.query_category && queryCategory?.length > 0 && queryCategory.find( item => item.category === data.query_category)?.subCategories.map((item, index) =>
                                                    <MenuItem
                                                        key={ index }
                                                        dense={ true }
                                                        value={ item }
                                                    >
                                                        { item }
                                                    </MenuItem>
                                                )
                                                }
                                            </TextField>
                                        </Grid>                                        
                                        <Grid item={true} xs={12} sm={12}>
                                            <InputLabel>{'Complaint Details'}</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                multiline={ true }
                                                maxRows={ 4 }
                                                name={ 'remarks' }
                                                type={ 'text' }
                                                value={
                                                    data && data.remarks ? data.remarks : ''
                                                }
                                                onChange={ this._onChange }
                                            />
                                        </Grid>
                                        <Grid item={ true } xs={ 12 } sm={ 12 } direction={ 'row' } container={ true } alignItems={ 'center' }>
                                            <InputLabel sx={{ mr: '1rem' }}>{'Is Information Correct?'}</InputLabel>
                                            <RadioGroup
                                                name={ 'is_information_correct' }
                                                value={ data && data.is_information_correct ? data.is_information_correct : false }
                                                onChange={ this._onChange }
                                                row={ true }
                                            >
                                                <FormControlLabel value={ 1 } control={ <Radio /> } label={ 'Yes' } />
                                                <FormControlLabel value={ 0 } control={ <Radio /> } label={ 'No' } />
                                            </RadioGroup>
                                        </Grid>

                                        <Grid item={ true } xs={ 12 } sm={ 12 }>
                                            <Divider sx={{ width: '100%' }} />  
                                        </Grid>

                                        <Grid item={ true } xs={ 12 } sm={ 12 } direction={ 'row' } container={ true } alignItems={ 'center' }>
                                            <InputLabel sx={{ mr: '1rem' }}>{ 'Choose SND' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                name={ 'snd' }
                                                value={ data.snd }
                                                onChange={ this._onChange }
                                                select={ true }
                                            >
                                                { ( !sndList || sndList.length === 0 ) &&
                                                    <MenuItem dense={ true } value=''><em>{ 'None' }</em></MenuItem>
                                                }
                                                
                                                { sndList && sndList.length > 0 && sndList.map((item, index) =>
                                                        <MenuItem
                                                            key={ index }
                                                            dense={ true }
                                                            value={ item.value ? item.value : item }
                                                        >
                                                            { item.label ? item.label : item }
                                                        </MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item={ true } xs={ 12 } sm={ 12 }>
                                            <InputLabel>{ 'Remarks' }</InputLabel>
                                            <TextField
                                                variant={ 'outlined' }
                                                margin={ 'none' }
                                                size={ 'small' }
                                                fullWidth={ true }
                                                multiline={ true }
                                                maxRows={ 4 }
                                                name={ 'remarks' }
                                                type={ 'text' }
                                                value={
                                                    remarks ? remarks : ''
                                                }
                                                onChange={ this._onRemarksChange }
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        { data?.status === 'OPEN' &&
                            <LoadingButton
                                loading={ isCancelledLoading }
                                fullWidth={ false }
                                variant={ 'contained' }
                                onClick={ this._handleTaskCancelled }
                                size={ 'small' }
                                color='error'
                                sx={{ position: 'absolute', left: '8px' }}
                                disabled={ isFlagEmergencyLoading || isDispatchLoading || isReopenLoading || isUpdateLoading }
                            >
                                { 'Cancel Task' }
                            </LoadingButton>
                        }
                        { (data?.status === 'ONGOING' && data?.realtime_tracking_url) &&
                            <Link
                                href={ data?.realtime_tracking_url ? `${BASE_URL +'/'+ data.realtime_tracking_url }` : '' }
                                target='_blank'
                                rel='noopener noreferrer'
                                sx={{
                                    mr: '8px'
                                }}
                            >
                                { 'Track Vehicle' }
                            </Link>
                        }

                        { user?.user_type === 'SUPERVISOR' &&
                            <LoadingButton
                                loading={ isFlagEmergencyLoading }
                                fullWidth={ false }
                                variant={ 'outlined' }
                                onClick={ this._handleFlagEmergency }
                                size={ 'small' }
                                disabled={ data?.is_emergency || data?.status === 'CLOSED' || data?.status === 'CANCELLED' || isCancelledLoading || isDispatchLoading || isReopenLoading || isUpdateLoading }
                                color='error'
                            >
                                { 'Flag Emergency' }
                            </LoadingButton>
                        }

                        <LoadingButton
                            loading={ isUpdateLoading }    
                            fullWidth={ false }
                            variant={ 'outlined' }
                            onClick={ this._handleUpdateChange }
                            size={ 'small' }
                            disabled={ data?.status === 'CLOSED' || data?.status === 'CANCELLED' || data?.status === 'RESOLVED' || isCancelledLoading || isDispatchLoading || isFlagEmergencyLoading || isReopenLoading }
                        >
                            { 'Update' }
                        </LoadingButton>

                        { data?.status === 'RESOLVED' &&
                            <LoadingButton
                                loading={ isReopenLoading }    
                                fullWidth={ false }
                                variant={ 'outlined' }
                                onClick={ this._handleTaskReopen }
                                size={ 'small' }
                                disabled={ isCancelledLoading || isFlagEmergencyLoading || isDispatchLoading || isUpdateLoading }
                            >
                                { 'Re-open' }
                            </LoadingButton>
                        }
                        
                        { data?.status === 'OPEN' ?
                            (
                                <LoadingButton
                                    loading={ isDispatchLoading }    
                                    fullWidth={ false }
                                    variant={ 'contained' }
                                    onClick={ this._handleDispatch }
                                    size={ 'small' }
                                    disabled={ data?.status !== 'OPEN' || isCancelledLoading || isFlagEmergencyLoading || isReopenLoading || isUpdateLoading }
                                >
                                    { 'Dispatch' }
                                </LoadingButton>
                            )
                            :
                            (
                                <LoadingButton
                                    loading={ isDispatchLoading }
                                    fullWidth={ false }
                                    variant={ 'contained' }
                                    onClick={ this._handleTaskClose }
                                    size={ 'small' }
                                    disabled={ data?.status !== 'RESOLVED' || isCancelledLoading || isFlagEmergencyLoading || isReopenLoading || isUpdateLoading }
                                >
                                    { 'Close Task' }
                                </LoadingButton>
                            )
                        }                        
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                    open={ Boolean(feedback) }
                    autoHideDuration={ 6000 }
                    onClose={ this._onFeedbackClose }
                >
                    <Alert
                        severity={ feedback?.status === 200 ? 'success' : 'error' }
                        onClose={ this._onFeedbackClose }
                        sx={{ width: '100%' }}
                    >
                        { feedback?.message ? feedback.message : 'Something went wrong!' }
                    </Alert>
                </Snackbar>
            </React.Fragment>
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

const statusStyles = {
    position: 'absolute',
    left: 16,
    top: 16
}

// PropTypes
TaskDetailsDialog.propTypes = {
    data: PropTypes.object,
    handleDialogOnClose: PropTypes.func,
    isDialogOpen: PropTypes.bool,
    sndList: PropTypes.array,
    user: PropTypes.object
}

TaskDetailsDialog.defaultProps = {
    data: {},
    handleDialogOnClose: () => null,
    isDialogOpen: false,
    sndList: [],
    user: {}
}

const mapStateToProps = state => ({
    sndList: state.task.sndList,
    user: state.auth.user,
    queryCategory: state.task.queryCategory,
})

export default connect(mapStateToProps, null)(TaskDetailsDialog)