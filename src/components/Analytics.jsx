import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { connect } from 'react-redux'

// Import Components
import { Box, TextField, Stack, Grid, Divider, CircularProgress } from '@mui/material'
import { DateRangePicker, LocalizationProvider, LoadingButton } from '@mui/lab'
import { ArrowRightAlt } from '@mui/icons-material'
import AdapterDayjs from '@mui/lab/AdapterDayjs'
import StyledCard from './common/StyledCard'
import StyledTable from './common/StyledTable'

// Import Actions
import { getAnalytics } from '../redux/actions/analyticsActions'
import { convertSecondsToTime } from '../utils/utils'
class Analytics extends React.PureComponent {
    state = {
        start_date: null,
        end_date: null,
    }

    componentDidMount = () => {
        const { dispatch } = this.props

        let date = new Date()
      
        const start_date = dayjs(new Date(date.setDate(date.getDate() - 6))).format('YYYY-MM-DD')
        const end_date = dayjs(new Date()).format('YYYY-MM-DD')

        this.setState({ start_date, end_date })

        // Get Analytics
        dispatch( getAnalytics({ start_date, end_date }) )
    }

    // Handle Date Range Change
    _handleDateRangeChange = dateValues => {
        const { start_date, end_date } = this.state
        // Get start date and end date from date range picker
        const startDate = dateValues[0]?.$d && dayjs(new Date(dateValues[0]?.$d)).format('YYYY-MM-DD')
        const endDate = dateValues[1]?.$d && dayjs(new Date(dateValues[1]?.$d)).format('YYYY-MM-DD')
        // Set state for start date and end date accordingly
        this.setState({ dateValues, start_date: startDate ?? start_date, end_date: endDate ?? end_date })
    }

    // Get Analytics
    _getAnalytics = () => {
        const { start_date, end_date } = this.state
        const { dispatch } = this.props

        // Get Analytics
        dispatch( getAnalytics({ start_date, end_date }) )
    }
    render() {
        const { start_date, end_date } = this.state
        const { analytics, isAnalyticsLoading } = this.props
        
        return (
            <Box width={ '100%' }>
                <Grid container spacing={ 2 }>
                    <Grid item xs={12} sm={ 12 }>
                        <Stack spacing={2} direction={ 'row' }>
                            <LocalizationProvider dateAdapter={ AdapterDayjs }>
                                <DateRangePicker
                                    value={ [ start_date, end_date ] }
                                    onChange={ this._handleDateRangeChange }
                                    disableMaskedInput={ true }
                                    inputFormat={ 'DD-MMM-YYYY' }
                                    renderInput={(startProps, endProps) => (                                            
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField {...startProps} size={ 'small' } fullWidth={ true } />
                                        <ArrowRightAlt />
                                        <TextField {...endProps} size={ 'small' } fullWidth={ true } />
                                    </Box>
                                    )}
                                    PopperProps={{
                                        placement: 'bottom-start',
                                    }}
                                    onClose={ () => setTimeout(() => { document.activeElement.blur() }, 0) }
                                />
                            </LocalizationProvider>
                            <LoadingButton 
                                loading={ false }
                                variant={ 'contained' }
                                onClick={ this._getAnalytics }
                                size={ 'small' }
                                disableTouchRipple={ true }                      
                            >
                                { 'Get Analytics' }
                            </LoadingButton>
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={ 12 }>
                        <Divider />
                        <Box sx={{ width: '100%', pt: '1rem' }}>
                            { isAnalyticsLoading ? 
                                <Box sx={ loadingContainerStyles }>
                                    <CircularProgress />
                                </Box>
                                :                                                               
                                <Grid container spacing={ 2 }>
                                    <Grid item xs={12} sm={ 4 }>
                                        <StyledCard 
                                            title={ 'Overall Ticket Status' }
                                            subData={                                                
                                                [ 
                                                    { label: 'Total Dispatched', value: analytics?.overall_ticket_status?.total_dispatched ?? '-' },
                                                    { label: 'Total Closed', value: analytics?.overall_ticket_status?.closed ?? '-' },
                                                    { label: 'Total Pending', value: analytics?.overall_ticket_status?.work_in_progress ?? '-' }
                                                ]
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={ 4 }>
                                        <StyledCard 
                                            title={ 'Open Ticket Work Bucket' }
                                            subData={                                                
                                                [ 
                                                    { label: 'Assigned to Despatcher', value: analytics?.open_ticket_work_bucket?.assigned_to_dispatcher ?? '-' },
                                                    { label: 'Assigned to SnD', value: analytics?.open_ticket_work_bucket?.assigned_to_snd ?? '-' },
                                                    { label: 'Assigned to Gang', value: analytics?.open_ticket_work_bucket?.assigned_to_fieldforce ?? '-' }
                                                ]
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={ 4 }>
                                        <StyledCard 
                                            title={ 'Open Complaint Priority Status' }
                                            subData={                                                
                                                [ 
                                                    { label: 'Priority High', value: analytics?.open_complaint_priority_status?.high ?? '-' },
                                                    { label: 'Priority Medium', value: analytics?.open_complaint_priority_status?.medium ?? '-' },
                                                    { label: 'Priority Low', value: analytics?.open_complaint_priority_status?.low ?? '-' }
                                                ]
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={ 12 }>
                                        <Grid container spacing={ 2 }>
                                            <Grid item xs={12} sm={ 6 }>
                                                <Stack spacing={ 2 }>
                                                <StyledTable                                                     
                                                    rows={[
                                                        { label: 'Open (Assigned to Despatcher)', value: analytics?.open_ticket_work_bucket?.open ?? '-' },
                                                        { label: 'Dispatched (Assigned to SnD)', value: analytics?.open_ticket_work_bucket?.dispatched ?? '-' },
                                                        { label: 'Resolved (Resolved by SnD)', value: analytics?.open_ticket_work_bucket?.resolved ?? '-' },
                                                        { label: 'Re-Open (Assigned to SnD)', value: analytics?.open_ticket_work_bucket?.reopen ?? '-' }
                                                    ]}
                                                />
                                                <StyledTable                                                    
                                                    rows={[
                                                        { label: 'Open Complaint', value: analytics?.overall_ticket_status?.work_in_progress ?? '-' },
                                                        { label: 'Open Complaint : In SL', value: analytics?.open_ticket_work_bucket?.open_complaint_in_sl ?? '-' },
                                                        { label: 'Open Complaint : Out of SL', value: analytics?.open_ticket_work_bucket?.open_complaint_out_sl ?? '-' },
                                                    ]}
                                                />
                                                <StyledTable
                                                    rows={[
                                                        { label: 'Ave. Closure Time', value: analytics?.open_ticket_work_bucket?.avg_closure_time ? convertSecondsToTime(analytics.open_ticket_work_bucket.avg_closure_time) : '-' },
                                                        { label: 'Ave. Dispatched Time', value: analytics?.open_ticket_work_bucket?.avg_dispatch_time ? convertSecondsToTime(analytics.open_ticket_work_bucket.avg_dispatch_time) : '-' },
                                                        { label: 'Ave. Resolved Time', value: analytics?.open_ticket_work_bucket?.avg_resolve_time ? convertSecondsToTime(analytics.open_ticket_work_bucket.avg_resolve_time) : '-' },
                                                    ]}
                                                />
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={ 6 }>
                                                <StyledTable
                                                    headers={[ 'Sub Category Name', 'Count' ]}
                                                    rows={ analytics?.sub_categories?.length > 0 ? 
                                                        analytics?.sub_categories.map(subCategory => ({
                                                            label: subCategory.query_sub_category,
                                                            value: subCategory.count
                                                        }))
                                                        
                                                        : [ 'No Data' ]
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid> 
                            }                                                       
                        </Box>
                    </Grid>
                </Grid>                
            </Box>
        )
    }
}

// JSS Styles
const loadingContainerStyles = {
    width: '100%',
    minHeight: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

// PropTypes
Analytics.propTypes = {    
    analytics: PropTypes.object,
    isAnalyticsLoading: PropTypes.bool
}

Analytics.defaultProps = {
    analytics: {},
    isAnalyticsLoading: false
}

const mapStateToProps = state => ({
    analytics: state.analytics.analytics,
    isAnalyticsLoading: state.analytics.isAnalyticsLoading,
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Analytics)