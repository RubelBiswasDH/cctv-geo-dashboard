import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Box, Card, CardContent, Divider } from '@mui/material'

class StyledCard extends React.PureComponent {
  render() {
    const { title, subData } = this.props          
    return (
      <Card sx={ cardContainerStyles } elevation={ 4 }>
        <CardContent sx={{ p: 0 }}>
          <h3 sx={ cardHeaderStyles }>{ title }</h3>
        </CardContent>
        <Divider light />
        <Box display={ 'flex' }>
            {
                subData?.length > 0 && subData.map((item, index) => 
                    <Box p={2} flex={ 'auto' } key={ item.label }>
                        <p style={labelStyles} key={ `label-${item.label}` }>{ item.label }</p>
                        <p style={valueStyles} key={ item.value }>{ item.value }</p>
                    </Box>
                )
            }          
        </Box>
      </Card>
    )
  }
}

// JSS Styles
const cardContainerStyles = {  
  textAlign: 'center',
  height: '100%'
}

const cardHeaderStyles = {
  fontSize: 18,
  fontWeight: 500,
  letterSpacing: '0.5px',
  marginTop: 0,
  marginBottom: 0,
}

const labelStyles = {
  fontSize: 14,
  color: '#000',
  fontWeight: 500,
  margin: 0
}

const valueStyles = {
  fontSize: 20,
  fontWeight: '500',
  marginBottom: 0,
  letterSpacing: '1px'
}

// PropTypes
StyledCard.propTypes = {
    title: PropTypes.string,
    subData: PropTypes.array
}

StyledCard.defaultProps = {
    title: 'Title',
    subData: []
}

export default StyledCard