import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

// Import Components
import { Paper, Button, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

class StyledStepperDate extends React.PureComponent {
    state = {
        activeIndex: 0,        
        dateList: []
    }

    componentDidMount = () => {
        this._createDateIndex()
        const { dateList } = this.state
        const { date } = this.props
        if (date) {            
            const newDateIndex = dateList.findIndex(d => d.date === date)
            if (newDateIndex >= 0) {
                this.setState({ activeIndex: newDateIndex })
            }
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { activeIndex, dateList } = this.state
        const { onChange, date } = this.props
        if (prevState.activeIndex !== activeIndex) {
            if (onChange) {
                onChange(new Date(dateList[activeIndex].date))
            }            
        }
        if (prevProps.date !== date) {            
            const newDateIndex = dateList.findIndex(d => d.date === date)
            if (newDateIndex >= 0) {
                this.setState({ activeIndex: newDateIndex })
            }
        }
    }

    _createDateIndex = () => {
        let dateList = []        
        for (let step = 0; step < 7; step++) {
            let date = new Date()
            dateList.push({ index: step, date: dayjs(new Date(date.setDate(date.getDate() - step))).format('YYYY-MM-DD') })
        }
        if (dateList && dateList.length > 0) {        
            this.setState({ dateList })
        }
    }

    // handleIndexChange
    _handleIndexChange = (type) => {        
        const { activeIndex } = this.state
        let date = new Date()
        if (type === 'next' && activeIndex !== 0) {
            date.setDate(date.getDate() + 1)
            this.setState({ activeIndex: activeIndex - 1, })
        }
        if (type === 'prev' && activeIndex !== 6) {
            date.setDate(date.getDate() - 1)
            this.setState({ activeIndex: activeIndex + 1 })
        } 
    }

    render() {
        const { activeIndex, dateList } = this.state

        return (
            <Paper
                variant='outlined'
                sx={{ p: '0.5rem', display: 'flex', justifyContent: 'space-between' }}
            >
                <Button
                    size={'small'}
                    onClick={ () => this._handleIndexChange('prev') }
                    disabled={activeIndex === 6}
                >
                    <KeyboardArrowLeft />
                    { 'Prev' }                
                </Button>
                <Typography
                    align='center'
                    fontSize='14px'
                    sx={theme => ({
                        marginTop: '4px',
                        color: theme.palette.text.secondary
                    })}
                >                    
                    { dateList && dateList[activeIndex] && dateList[activeIndex].date ? dateList[activeIndex].date  : '' }
                </Typography>
                <Button
                    size={'small'}
                    onClick={ () => this._handleIndexChange('next') }
                    disabled={activeIndex === 0}
                >
                    { 'Next' }
                    <KeyboardArrowRight />
                </Button>
            </Paper>
        )
    }
}

// PropTypes
StyledStepperDate.propTypes = {        
    onChange: PropTypes.func,
    date: PropTypes.string
}

StyledStepperDate.defaultProps = {
    onChange: () => null,
    date: ''
}

export default StyledStepperDate