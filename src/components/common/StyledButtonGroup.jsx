import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'

class StyledButtonGroup extends React.PureComponent {
  render() {
    const { data, value, onChange,...restProps } = this.props

    return (
      <ToggleButtonGroup
        exclusive={ true }
        size='small'
        fullWidth={ true }
        value={ value }
        onChange={ onChange }
        orientation={ window.innerWidth < 768 ? 'vertical' : 'horizontal' }
        { ...restProps }
      >
        {
          data && data.length > 0 &&
            data.map(d =>
              <ToggleButton
                key={ d.id ? d.id : d }
                value={d.value ? d.value : d}
                sx={{ textTransform: 'capitalize' }}
              >
                <Typography fontSize='14px'>{ d.label ? d.label : d }</Typography>
              </ToggleButton>
            )
        }
      </ToggleButtonGroup>
    )
  }
}

// PropTypes
StyledButtonGroup.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  onChange: PropTypes.func
}

StyledButtonGroup.defaultProps = {
  data: [{}],
  value: '',
  onChange: () => null
}

export default StyledButtonGroup